import Foundation

typealias Language = String
extension Language {
    static let zh: Language = "zh"
    static let en: Language = "en"
}

typealias Currency = String
extension Currency {
    static let cny: Currency = "CNY"
    static let usd: Currency = "USD"
}

struct Profile: Codable, Identifiable {
    let id: String
    var displayName: String
    var avatarUrl: String
    var preferredLanguage: Language
    var preferredCurrency: Currency
}

struct FirePlan: Codable, Identifiable {
    let id: String
    let userId: String
    var annualSpending: Double
    var withdrawalRate: Double
    var targetAmount: Double
    var currency: Currency
    var updatedAt: Date
}

struct Checkin: Codable, Identifiable {
    let id: String
    let planId: String
    var checkinDate: Date
    var currentNetWorth: Double
    var annualSpending: Double
    var note: String
    var createdAt: Date
}

struct AppSettings {
    var language: Language = .zh
    var currency: Currency = .cny
    var defaultWithdrawalRate: Double = 0.04
    var demoMode: Bool = true
}
