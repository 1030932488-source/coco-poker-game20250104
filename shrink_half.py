# -*- coding: utf-8 -*-
"""将Card预制体缩小到原来的一半"""
import json

def shrink_card_half():
    file_path = r'd:\coco_poker\assets\prefabs\Card.prefab'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 新尺寸:100x140的一半 = 50x70
    new_width = 50
    new_height = 70
    
    modified_count = 0
    for item in data:
        if isinstance(item, dict) and item.get('__type__') == 'cc.UITransform':
            content_size = item.get('_contentSize', {})
            old_width = content_size.get('width', 0)
            old_height = content_size.get('height', 0)
            
            if old_width == 100 and old_height == 140:
                item['_contentSize'] = {
                    "__type__": "cc.Size",
                    "width": new_width,
                    "height": new_height
                }
                modified_count += 1
                print(f'卡牌大小: {old_width}x{old_height} -> {new_width}x{new_height}')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'修改完成!')

if __name__ == '__main__':
    shrink_card_half()
