import { _decorator, Component, Prefab, instantiate, Vec3 } from 'cc';
import { CardView } from './CardView';
import { CardModel } from '../models/CardModel';
const { ccclass, property } = _decorator;

/**
 * 主牌区视图
 * 负责主牌区卡牌的显示和管理
 */
@ccclass('PlayfieldView')
export class PlayfieldView extends Component {
    @property(Prefab)
    cardPrefab: Prefab = null!; // 卡牌预制体

    /** 卡牌视图映射表 */
    private _cardViewMap: Map<number, CardView> = new Map();
    /** 卡牌点击回调 */
    private _onCardClickCallback: ((cardId: number) => void) | null = null;

    /**
     * 初始化主牌区视图
     * @param cards 卡牌列表
     * @param onCardClickCallback 卡牌点击回调
     */
    public init(cards: CardModel[], onCardClickCallback: (cardId: number) => void): void {
        console.log('[PlayfieldView.init] 开始初始化, 卡牌数量:', cards.length);
        console.log('[PlayfieldView.init] cardPrefab:', this.cardPrefab);
        this._onCardClickCallback = onCardClickCallback;
        this.createCardViews(cards);
        console.log('[PlayfieldView.init] 初始化完成, _cardViewMap大小:', this._cardViewMap.size);
    }

    /**
     * 创建卡牌视图
     */
    private createCardViews(cards: CardModel[]): void {
        console.log('[PlayfieldView.createCardViews] 开始创建卡牌视图, 数量:', cards.length);
        cards.forEach((card, index) => {
            console.log(`[PlayfieldView] 创建第${index + 1}张卡牌, ID:${card.id}, 位置:`, card.position);
            const cardNode = instantiate(this.cardPrefab);
            console.log('[PlayfieldView] cardNode创建成功:', cardNode ? '是' : '否');
            const cardView = cardNode.getComponent(CardView);
            console.log('[PlayfieldView] CardView组件:', cardView ? '获取成功' : '获取失败');
            if (cardView) {
                // 主牌区位置由关卡配置决定
                cardNode.setPosition(card.position);
                cardView.init(card, (cardId) => {
                    if (this._onCardClickCallback) {
                        this._onCardClickCallback(cardId);
                    }
                });
                this.node.addChild(cardNode);
                this._cardViewMap.set(card.id, cardView);
                console.log(`[PlayfieldView] 卡牌${card.id}添加到场景成功`);
            }
        });
        console.log('[PlayfieldView.createCardViews] 所有卡牌创建完成');
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
     * 播放卡牌移动动画
     */
    public playCardMoveAnimation(cardId: number, targetPosition: Vec3, callback?: () => void): void {
        const cardView = this._cardViewMap.get(cardId);
        if (cardView) {
            cardView.playMoveAnimation(targetPosition, 0.3, callback);
        }
    }

    /**
     * 获取卡牌视图
     */
    public getCardView(cardId: number): CardView | undefined {
        return this._cardViewMap.get(cardId);
    }
}

