import Foundation

struct Insight: Identifiable {
    let id: String
    let kind: Kind
    let title: String
    let body: String

    enum Kind: String {
        case growth, spending, target, milestone
    }
}

enum InsightEngine {
    static func build(plan: FirePlan, checkins: [Checkin], lang: Language) -> [Insight] {
        let sorted = checkins.sorted { $0.checkinDate < $1.checkinDate }
        guard sorted.count >= 2 else { return [] }

        let latest = sorted[sorted.count - 1]
        let previous = sorted[sorted.count - 2]
        let metrics = FireCalculator.calculate(
            annualSpending: latest.annualSpending,
            currentNetWorth: latest.currentNetWorth,
            withdrawalRate: plan.withdrawalRate
        )

        let growthDelta = latest.currentNetWorth - previous.currentNetWorth
        let priorIndex = max(sorted.count - 3, 0)
        let priorGrowthDelta = previous.currentNetWorth - sorted[priorIndex].currentNetWorth
        let milestones = FireCalculator.milestones(progress: metrics.progress).filter(\.reached)
        let dict = Dictionaries.shared[lang]

        var insights: [Insight] = []

        if growthDelta > priorGrowthDelta {
            insights.append(Insight(
                id: "growth", kind: .growth,
                title: dict["growthSpeedUp"] ?? "",
                body: dict["growthSpeedUpDesc"] ?? ""
            ))
        }

        if latest.annualSpending > previous.annualSpending {
            insights.append(Insight(
                id: "spending", kind: .spending,
                title: dict["spendingUp"] ?? "",
                body: dict["spendingUpDesc"] ?? ""
            ))
        }

        insights.append(Insight(
            id: "target", kind: .target,
            title: dict["targetUpdated"] ?? "",
            body: "\(dict["target"] ?? ""): \(Int(latest.annualSpending))"
        ))

        let milestoneText: String
        if let last = milestones.last {
            milestoneText = "\(dict["reached"] ?? "") \(last.label)"
        } else {
            milestoneText = dict["milestoneApproaching"] ?? ""
        }
        insights.append(Insight(
            id: "milestone", kind: .milestone,
            title: dict["milestoneReached"] ?? "",
            body: milestoneText
        ))

        return insights
    }
}
