import json
import os

SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'

def diagnose_and_fix():
    print(f"Diagnosing {SCENE_PATH}...")
    if not os.path.exists(SCENE_PATH):
        print("Scene file not found!")
        return

    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. Find Canvas Node
    canvas_node_idx = -1
    canvas_node = None
    for i, item in enumerate(data):
        if item.get('__type__') == 'cc.Node' and item.get('_name') == 'Canvas':
            canvas_node_idx = i
            canvas_node = item
            print(f"Found Canvas Node at index {i}")
            break
    
    if canvas_node_idx == -1:
        print("ERROR: Canvas node not found!")
        return

    # 2. Find attached components
    component_indices = []
    if '_components' in canvas_node:
        for comp in canvas_node['_components']:
            if '__id__' in comp:
                component_indices.append(comp['__id__'])
    
    print(f"Canvas components indices: {component_indices}")

    # 3. Analyze components
    uitransform_idx = -1
    canvas_comp_idx = -1

    for idx in component_indices:
        if idx < len(data):
            comp = data[idx]
            comp_type = comp.get('__type__')
            print(f"  Component {idx}: {comp_type}")
            if comp_type == 'cc.UITransform':
                uitransform_idx = idx
            elif comp_type == 'cc.Canvas':
                canvas_comp_idx = idx

    # 4. Check UITransform
    if uitransform_idx != -1:
        uitrans = data[uitransform_idx]
        print(f"Checking UITransform at {uitransform_idx}...")
        if '_anchorPoint' not in uitrans:
            print("  ERROR: _anchorPoint MISSING in Canvas UITransform!")
            print("  FIXING: Adding _anchorPoint...")
            uitrans['_anchorPoint'] = {"__type__": "cc.Vec2", "x": 0.5, "y": 0.5}
        else:
            print(f"  _anchorPoint exists: {uitrans['_anchorPoint']}")
        
        # Ensure content size is correct
        if '_contentSize' not in uitrans:
            print("  ERROR: _contentSize MISSING in Canvas UITransform!")
            uitrans['_contentSize'] = {"__type__": "cc.Size", "width": 1080, "height": 2080}
        else:
             print(f"  _contentSize exists: {uitrans['_contentSize']}")
    else:
        print("ERROR: UITransform NOT FOUND on Canvas Node! This is critical.")
        # Create a new UITransform and attach it? 
        # Usually better to find why it's missing. But let's assume we can fix existing one if found.
    
    # 5. Save if modified
    with open(SCENE_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Diagnosis and Fix complete.")

if __name__ == '__main__':
    diagnose_and_fix()
