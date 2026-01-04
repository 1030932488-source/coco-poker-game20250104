import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
import { CardView } from './CardView';
import { CardModel } from '../models/CardModel';
const { ccclass, property } = _decorator;

/**
 * 备用牌堆视图
 * 负责备用牌堆的显示和管理
 */
@ccclass('StackView')
export class StackView extends Component {
    @property(Prefab)
    cardPrefab: Prefab = null!; // 卡牌预制体

    /** 卡牌视图映射表 */
    private _cardViewMap: Map<number, CardView> = new Map();
    /** 点击“备用牌堆区域”的回调（抽一张牌） */
    private _onStackClickCallback: (() => void) | null = null;

    /**
     * 初始化备用牌堆视图
     * @param cards 卡牌列表
     * @param onCardClickCallback 卡牌点击回调
     */
    public init(cards: CardModel[], onStackClickCallback: () => void): void {
        this._onStackClickCallback = onStackClickCallback;
        this.createCardViews(cards);
        this._setupTouchEvent();
    }

    /**
     * 设置堆牌区域触摸事件（点击抽牌）
     */
    private _setupTouchEvent(): void {
        this.node.on(Node.EventType.TOUCH_END, this._onStackAreaClick, this);
    }

    private _onStackAreaClick(): void {
        if (this._onStackClickCallback) {
            this._onStackClickCallback();
        }
    }

    /**
     * 创建卡牌视图
     */
    private createCardViews(cards: CardModel[]): void {
        cards.forEach(card => {
            const cardNode = instantiate(this.cardPrefab);
            const cardView = cardNode.getComponent(CardView);
            if (cardView) {
                // 备用牌堆所有牌叠在同一位置（0,0）
                cardNode.setPosition(new Vec3(0, 0, 0));
                // 备用牌堆牌面通常是背面朝上；点击由 StackView 的区域触摸统一处理
                cardView.init(card, () => { });
                this.node.addChild(cardNode);
                this._cardViewMap.set(card.id, cardView);
            }
        });
    }

    /**
     * 更新卡牌视图
     */
    public updateCardView(cardId: number): void {
        const cardView = this._cardViewMap.get(cardId);
        if (cardView) {
            cardView.updateDisplay();
        }
    }

    /**
     * 播放翻牌动画
     */
    public playFlipAnimation(cardId: number, callback?: () => void): void {
        const cardView = this._cardViewMap.get(cardId);
        if (cardView) {
            cardView.playFlipAnimation(callback);
        }
    }

    /**
     * 获取卡牌视图
     */
    public getCardView(cardId: number): CardView | undefined {
        return this._cardViewMap.get(cardId);
    }
}

