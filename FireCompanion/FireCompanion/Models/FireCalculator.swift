import Foundation

struct FireMetrics {
    let targetAmount: Double
    let progress: Double
    let gap: Double
}

struct MilestoneState {
    let label: String
    let reached: Bool
}

enum FireCalculator {
    static func normalizeWithdrawalRate(_ value: Double) -> Double {
        value > 1 ? value / 100 : value
    }

    static func calculate(annualSpending: Double, currentNetWorth: Double, withdrawalRate: Double) -> FireMetrics {
        let rate = normalizeWithdrawalRate(withdrawalRate)
        let target = annualSpending / rate
        let progress = currentNetWorth / target
        let gap = max(target - currentNetWorth, 0)
        return FireMetrics(targetAmount: target, progress: progress, gap: gap)
    }

    static func milestones(progress: Double) -> [MilestoneState] {
        [0.25, 0.5, 0.75, 1.0].map { threshold in
            MilestoneState(label: "\(Int(threshold * 100))%", reached: progress >= threshold)
        }
    }
}
