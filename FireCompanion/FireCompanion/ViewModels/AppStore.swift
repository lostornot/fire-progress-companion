import Foundation
import SwiftUI

@MainActor
@Observable
final class AppStore {
    var ready = false
    var mode: AppMode = .demo
    var session: Session?
    var profile = Profile(id: "demo-user", displayName: "Demo User", avatarUrl: "", preferredLanguage: .zh, preferredCurrency: .cny)
    var plan = FirePlan(id: "demo-plan", userId: "demo-user", annualSpending: 180000, withdrawalRate: 0.04, targetAmount: 4500000, currency: .cny, updatedAt: Date())
    var checkins: [Checkin] = [
        Checkin(id: "c1", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1740787200), currentNetWorth: 1420000, annualSpending: 170000, note: "noteSteady", createdAt: Date()),
        Checkin(id: "c2", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1743465600), currentNetWorth: 1515000, annualSpending: 175000, note: "noteBonus", createdAt: Date()),
        Checkin(id: "c3", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1746057600), currentNetWorth: 1650000, annualSpending: 180000, note: "noteTravel", createdAt: Date()),
    ]
    var settings = AppSettings()

    enum AppMode { case demo, supabase }
    struct Session { let userId: String; let token: String }

    var lang: Language { settings.language }
    var dict: [String: String] { Dictionaries.shared[lang] }
    func t(_ key: String) -> String { Dictionaries.shared.t(lang, key) }

    var metrics: FireMetrics {
        let latest = checkins.sorted { $0.checkinDate < $1.checkinDate }.last ?? checkins[0]
        return FireCalculator.calculate(annualSpending: latest.annualSpending, currentNetWorth: latest.currentNetWorth, withdrawalRate: plan.withdrawalRate)
    }

    var sortedCheckins: [Checkin] {
        checkins.sorted { $0.checkinDate < $1.checkinDate }
    }

    var insights: [Insight] {
        InsightEngine.build(plan: plan, checkins: checkins, lang: lang)
    }

    // MARK: - Actions

    func bootstrap() {
        if SupabaseConfig.shared.isConfigured {
            mode = .supabase
        }
        ready = true
    }

    func signInDemo() {
        session = Session(userId: "demo-user", token: "")
        mode = .demo
    }

    func signOut() {
        session = nil
        plan = FirePlan(id: "demo-plan", userId: "demo-user", annualSpending: 180000, withdrawalRate: 0.04, targetAmount: 4500000, currency: .cny, updatedAt: Date())
        checkins = [
            Checkin(id: "c1", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1740787200), currentNetWorth: 1420000, annualSpending: 170000, note: "noteSteady", createdAt: Date()),
            Checkin(id: "c2", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1743465600), currentNetWorth: 1515000, annualSpending: 175000, note: "noteBonus", createdAt: Date()),
            Checkin(id: "c3", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1746057600), currentNetWorth: 1650000, annualSpending: 180000, note: "noteTravel", createdAt: Date()),
        ]
    }

    func addCheckin(date: Date, netWorth: Double, spending: Double, note: String) {
        let newCheckin = Checkin(
            id: UUID().uuidString,
            planId: plan.id,
            checkinDate: date,
            currentNetWorth: netWorth,
            annualSpending: spending,
            note: note,
            createdAt: Date()
        )
        checkins.append(newCheckin)

        let newMetrics = FireCalculator.calculate(annualSpending: spending, currentNetWorth: netWorth, withdrawalRate: plan.withdrawalRate)
        plan.annualSpending = spending
        plan.targetAmount = newMetrics.targetAmount
        plan.updatedAt = Date()
    }

    func resetDemo() {
        session = nil
        profile = Profile(id: "demo-user", displayName: "Demo User", avatarUrl: "", preferredLanguage: .zh, preferredCurrency: .cny)
        plan = FirePlan(id: "demo-plan", userId: "demo-user", annualSpending: 180000, withdrawalRate: 0.04, targetAmount: 4500000, currency: .cny, updatedAt: Date())
        checkins = [
            Checkin(id: "c1", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1740787200), currentNetWorth: 1420000, annualSpending: 170000, note: "noteSteady", createdAt: Date()),
            Checkin(id: "c2", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1743465600), currentNetWorth: 1515000, annualSpending: 175000, note: "noteBonus", createdAt: Date()),
            Checkin(id: "c3", planId: "demo-plan", checkinDate: Date(timeIntervalSince1970: 1746057600), currentNetWorth: 1650000, annualSpending: 180000, note: "noteTravel", createdAt: Date()),
        ]
        settings = AppSettings()
    }
}
