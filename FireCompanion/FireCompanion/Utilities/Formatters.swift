import Foundation

enum Formatters {
    static func currency(_ value: Double, currency: Currency, lang: Language) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currency
        formatter.maximumFractionDigits = 0
        formatter.locale = Locale(identifier: lang == .zh ? "zh_CN" : "en_US")
        return formatter.string(from: NSNumber(value: value)) ?? "\(value)"
    }

    static func percent(_ value: Double, lang: Language) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .percent
        formatter.minimumFractionDigits = 1
        formatter.maximumFractionDigits = 1
        formatter.locale = Locale(identifier: lang == .zh ? "zh_CN" : "en_US")
        return formatter.string(from: NSNumber(value: value)) ?? "\(value)"
    }

    static func date(_ value: Date, lang: Language) -> String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.locale = Locale(identifier: lang == .zh ? "zh_CN" : "en_US")
        return formatter.string(from: value)
    }

    static func shortDate(_ value: Date) -> String {
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: value)
    }
}
