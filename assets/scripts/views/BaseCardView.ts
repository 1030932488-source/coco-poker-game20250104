import { _decorator, Component, Vec3 } from 'cc';
import { CardView } from './CardView';
const { ccclass, property } = _decorator;

/**
 * 底牌视图
 * 负责底牌的显示
 */
@ccclass('BaseCardView')
export class BaseCardView extends Component {
    /**
     * 获取底牌区锚点的世界坐标
     * （默认用本节点作为锚点，MoveTo 到这里）
     */
    public getAnchorWorldPosition(): Vec3 {
        return this.node.getWorldPosition(new Vec3());
    }

    /**
     * 将一张卡牌视图挂到“底牌区”并归零位置
     */
    public attachCard(cardView: CardView): void {
        cardView.node.setParent(this.node);
        cardView.node.setPosition(Vec3.ZERO);
        // 置顶显示
        cardView.node.setSiblingIndex(this.node.children.length - 1);
    }
}

