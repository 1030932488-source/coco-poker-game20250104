import json
import os

SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'
GAME_VIEW_TYPE = "aa25eyiPYtCuLsjnCXmXwxl"

def unbind_game_view():
    print(f"Unbinding GameView in {SCENE_PATH}...")
    
    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    count = 0
    for item in data:
        if item.get('__type__') == GAME_VIEW_TYPE:
            print("Found GameView, resetting properties to null...")
            item['playfieldArea'] = None
            item['stackArea'] = None
            item['baseCardArea'] = None
            item['undoButton'] = None
            item['scoreLabel'] = None
            count += 1

    if count > 0:
        with open(SCENE_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("Unbinding complete.")
    else:
        print("GameView component not found.")

if __name__ == '__main__':
    unbind_game_view()
