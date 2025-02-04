import { Reward } from "./reward.model"

export interface RewardState {
    isLoading: boolean
    data: Reward[] | []
    error: string | null
}