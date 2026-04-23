"""
Sample ~500 random Hugging Face models spread across all pipeline task categories.
Outputs results to models_sample.json and models_sample.csv.
"""

import json
import csv
import time
import random
import ssl
import urllib.request
import urllib.parse
from collections import defaultdict

# macOS often lacks root certs for Python; bypass verification for public HF API
SSL_CTX = ssl.create_default_context()
SSL_CTX.check_hostname = False
SSL_CTX.verify_mode = ssl.CERT_NONE

TASKS = [
    "any-to-any", "audio-classification", "audio-to-audio", "audio-text-to-text",
    "automatic-speech-recognition", "depth-estimation", "document-question-answering",
    "visual-document-retrieval", "feature-extraction", "fill-mask",
    "image-classification", "image-feature-extraction", "image-segmentation",
    "image-to-image", "image-text-to-text", "image-text-to-image", "image-text-to-video",
    "image-to-text", "image-to-video", "keypoint-detection", "mask-generation",
    "object-detection", "video-classification", "question-answering",
    "reinforcement-learning", "sentence-similarity", "summarization",
    "table-question-answering", "tabular-classification", "tabular-regression",
    "text-classification", "text-generation", "text-ranking", "text-to-image",
    "text-to-speech", "text-to-video", "token-classification", "translation",
    "unconditional-image-generation", "video-text-to-text", "video-to-video",
    "visual-question-answering", "zero-shot-classification",
    "zero-shot-image-classification", "zero-shot-object-detection",
    "text-to-3d", "image-to-3d",
]

TARGET_TOTAL = 500
PER_TASK = max(1, TARGET_TOTAL // len(TASKS))  # ~10 per task
FETCH_POOL = 100  # fetch this many per task, then randomly pick PER_TASK from them


def fetch_models_for_task(task: str, limit: int = FETCH_POOL) -> list[dict]:
    params = urllib.parse.urlencode({
        "pipeline_tag": task,
        "limit": limit,
        "sort": "downloads",
        "full": "false",
    })
    url = f"https://huggingface.co/api/models?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hfsearch-sampler/1.0"})
        with urllib.request.urlopen(req, timeout=15, context=SSL_CTX) as resp:
            return json.loads(resp.read())
    except Exception as e:
        print(f"  [warn] {task}: {e}")
        return []


def fetch_card_summary(model_id: str) -> str:
    """Fetch first non-empty line of model card as a brief description."""
    url = f"https://huggingface.co/{model_id}/raw/main/README.md"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hfsearch-sampler/1.0"})
        with urllib.request.urlopen(req, timeout=10, context=SSL_CTX) as resp:
            raw = resp.read().decode("utf-8", errors="ignore")
        # Skip YAML frontmatter and find first meaningful paragraph
        lines = raw.splitlines()
        in_frontmatter = False
        past_frontmatter = False
        for line in lines:
            stripped = line.strip()
            if stripped == "---":
                if not past_frontmatter:
                    in_frontmatter = not in_frontmatter
                    if not in_frontmatter:
                        past_frontmatter = True
                continue
            if in_frontmatter:
                continue
            # Skip headings, badges, html, empty lines
            if (stripped and not stripped.startswith("#") and not stripped.startswith("![")
                    and not stripped.startswith("<") and not stripped.startswith("[!")
                    and not stripped.startswith("[![") and len(stripped) > 30):
                return stripped[:200]
    except Exception:
        pass
    return ""


def main():
    all_models = []
    task_counts = defaultdict(int)

    print(f"Sampling ~{PER_TASK} models from each of {len(TASKS)} task categories...\n")

    for i, task in enumerate(TASKS):
        print(f"[{i+1}/{len(TASKS)}] {task}", end=" ", flush=True)
        pool = fetch_models_for_task(task)
        if not pool:
            print("→ 0 results")
            continue

        sample = random.sample(pool, min(PER_TASK, len(pool)))
        print(f"→ {len(sample)} sampled (pool: {len(pool)})")

        for m in sample:
            all_models.append({
                "id": m.get("id", ""),
                "task": task,
                "downloads": m.get("downloads", 0),
                "likes": m.get("likes", 0),
                "tags": ", ".join(m.get("tags", [])[:8]),
                "description": "",
            })
            task_counts[task] += 1

        time.sleep(0.4)  # stay well under rate limit

    # Trim to exactly 500 if over
    random.shuffle(all_models)
    all_models = all_models[:TARGET_TOTAL]

    print(f"\nFetching model card descriptions for {len(all_models)} models...")
    for i, m in enumerate(all_models):
        if i % 50 == 0:
            print(f"  {i}/{len(all_models)}")
        m["description"] = fetch_card_summary(m["id"])
        time.sleep(0.3)

    # Save JSON
    with open("models_sample.json", "w") as f:
        json.dump(all_models, f, indent=2)

    # Save CSV
    with open("models_sample.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "task", "downloads", "likes", "tags", "description"])
        writer.writeheader()
        writer.writerows(all_models)

    print(f"\nDone. {len(all_models)} models saved to models_sample.json and models_sample.csv")
    print("\nBreakdown by task:")
    for task, count in sorted(task_counts.items(), key=lambda x: -x[1]):
        print(f"  {task:<40} {count}")


if __name__ == "__main__":
    random.seed(42)
    main()
