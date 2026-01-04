import json
import os

SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'
META_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene.meta'

def check_scene():
    print(f"Checking {SCENE_PATH}...")
    
    # 1. 验证 JSON 格式
    try:
        with open(SCENE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        print("JSON format is VALID.")
    except json.JSONDecodeError as e:
        print(f"JSON format is INVALID: {e}")
        return

    # 2. 检查基本结构
    if not isinstance(data, list):
        print("Error: Scene data should be a list.")
    else:
        print(f"Scene data is a list with {len(data)} items.")

    # 3. 检查 UUID
    try:
        with open(META_PATH, 'r', encoding='utf-8') as f:
            meta = json.load(f)
        print(f"Meta UUID: {meta.get('uuid')}")
    except Exception as e:
        print(f"Could not read meta file: {e}")

if __name__ == '__main__':
    check_scene()
