import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

/**
 * 游戏主视图
 * 负责游戏界面的整体布局和UI显示
 */
@ccclass('GameView')
export class GameView extends Component {
    @property(Node)
    playfieldArea: Node = null!; // 主牌区容器

    @property(Node)
    stackArea: Node = null!; // 备用牌堆容器

    @property(Node)
    baseCardArea: Node = null!; // 底牌区域容器

    @property(Button)
    undoButton: Button = null!; // 回退按钮

    @property(Label)
    scoreLabel: Label = null!; // 分数标签

    /** 回退按钮点击回调 */
    private _onUndoClickCallback: (() => void) | null = null;

    /**
     * 初始化视图
     * @param onUndoClickCallback 回退按钮点击回调
     */
    public init(onUndoClickCallback: () => void): void {
        this._onUndoClickCallback = onUndoClickCallback;
        this.setupButtons();
    }

    /**
     * 设置按钮事件
     */
    private setupButtons(): void {
        if (this.undoButton) {
            this.undoButton.node.on(Button.EventType.CLICK, this._onUndoClick, this);
        }
    }

    /**
     * 回退按钮点击事件
     */
    private _onUndoClick(): void {
        if (this._onUndoClickCallback) {
            this._onUndoClickCallback();
        }
    }

    /**
     * 更新分数显示
     * @param score 分数
     */
    public updateScore(score: number): void {
        if (this.scoreLabel) {
            this.scoreLabel.string = score.toString();
        }
    }

    /**
     * 设置回退按钮可用状态
     * @param enabled 是否可用
     */
    public setUndoButtonEnabled(enabled: boolean): void {
        if (this.undoButton) {
            this.undoButton.interactable = enabled;
        }
    }
}

