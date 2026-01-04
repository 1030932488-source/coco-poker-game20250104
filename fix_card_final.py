# -*- coding: utf-8 -*-
"""增大Card预制体尺寸到120x168"""
import json

def fix_card_size():
    file_path = r'd:\coco_poker\assets\prefabs\Card.prefab'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 增大卡牌尺寸
    new_width = 120
    new_height = 168
    
    for item in data:
        if isinstance(item, dict) and item.get('__type__') == 'cc.UITransform':
            content_size = item.get('_contentSize', {})
            old_width = content_size.get('width', 0)
            old_height = content_size.get('height', 0)
            
            # 修改主节点的UITransform(50x70的那个)
            if old_width == 50 and old_height == 70:
                item['_contentSize'] = {
                    "__type__": "cc.Size",
                    "width": new_width,
                    "height": new_height
                }
                print(f'卡牌大小: {old_width}x{old_height} -> {new_width}x{new_height}')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print('Card.prefab 修改完成!')

if __name__ == '__main__':
    fix_card_size()
