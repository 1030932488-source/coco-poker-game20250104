# -*- coding: utf-8 -*-
"""修改Card预制体的UITransform大小"""
import json

def fix_card_size():
    file_path = r'd:\coco_poker\assets\prefabs\Card.prefab'
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 新的卡牌尺寸
    new_width = 150
    new_height = 200
    
    modified_count = 0
    for item in data:
        if isinstance(item, dict) and item.get('__type__') == 'cc.UITransform':
            content_size = item.get('_contentSize', {})
            old_width = content_size.get('width', 0)
            old_height = content_size.get('height', 0)
            
            # 只修改主节点的UITransform(尺寸100x100的那个)
            if old_width == 100 and old_height == 100:
                item['_contentSize'] = {
                    "__type__": "cc.Size",
                    "width": new_width,
                    "height": new_height
                }
                modified_count += 1
                print(f'修改 UITransform: {old_width}x{old_height} -> {new_width}x{new_height}')
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f'总共修改了 {modified_count} 个 UITransform')
    return modified_count > 0

if __name__ == '__main__':
    fix_card_size()
