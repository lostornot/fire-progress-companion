import Foundation

final class SupabaseConfig {
    static let shared = SupabaseConfig()

    let url: String
    let key: String
    let isConfigured: Bool

    private init() {
        url = Bundle.main.infoDictionary?["SUPABASE_URL"] as? String ?? ""
        key = Bundle.main.infoDictionary?["SUPABASE_KEY"] as? String ?? ""
        isConfigured = !url.isEmpty && !key.isEmpty && !url.contains("your-supabase")
    }
}

enum SupabaseAPI {
    private static var baseURL: String { SupabaseConfig.shared.url }
    private static var apiKey: String { SupabaseConfig.shared.key }

    private static func request(path: String, method: String = "GET", body: Data? = nil, token: String? = nil) async throws -> (Data, URLResponse) {
        var urlRequest = URLRequest(url: URL(string: "\(baseURL)/rest/v1\(path)")!)
        urlRequest.httpMethod = method
        urlRequest.setValue(apiKey, forHTTPHeaderField: "apikey")
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        if let token {
            urlRequest.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        if let body {
            urlRequest.httpBody = body
            urlRequest.setValue("return=representation", forHTTPHeaderField: "Prefer")
        }
        return try await URLSession.shared.data(for: urlRequest)
    }

    static func signInWithGoogle() async throws -> URL {
        var urlRequest = URLRequest(url: URL(string: "\(baseURL)/auth/v1/authorize?provider=google&redirect_to=firecompanion://auth/callback")!)
        urlRequest.setValue(apiKey, forHTTPHeaderField: "apikey")
        let (_, response) = try await URLSession.shared.data(for: urlRequest)
        return (response as? HTTPURLResponse)?.url ?? URL(string: "firecompanion://auth/callback")!
    }

    static func fetchProfile(userId: String, token: String) async throws -> Profile? {
        let (data, _) = try await request(path: "/profiles?id=eq.\(userId)&select=*", token: token)
        let rows = try JSONDecoder().decode([ProfileRow].self, from: data)
        return rows.first.map { Profile(id: $0.id, displayName: $0.display_name, avatarUrl: $0.avatar_url, preferredLanguage: $0.preferred_language, preferredCurrency: $0.preferred_currency) }
    }

    static func fetchPlan(userId: String, token: String) async throws -> FirePlan? {
        let (data, _) = try await request(path: "/fire_plans?user_id=eq.\(userId)&order=created_at.desc&limit=1", token: token)
        let rows = try JSONDecoder().decode([PlanRow].self, from: data)
        return rows.first.map { FirePlan(id: $0.id, userId: $0.user_id, annualSpending: $0.annual_spending, withdrawalRate: $0.withdrawal_rate, targetAmount: $0.target_amount, currency: $0.currency, updatedAt: ISO8601DateFormatter().date(from: $0.updated_at) ?? Date()) }
    }

    static func fetchCheckins(userId: String, token: String) async throws -> [Checkin] {
        let (data, _) = try await request(path: "/checkins?user_id=eq.\(userId)&order=checkin_date.asc", token: token)
        let rows = try JSONDecoder().decode([CheckinRow].self, from: data)
        return rows.map { Checkin(id: $0.id, planId: $0.plan_id, checkinDate: ISO8601DateFormatter().date(from: $0.checkin_date) ?? Date(), currentNetWorth: $0.current_net_worth, annualSpending: $0.annual_spending, note: $0.note, createdAt: ISO8601DateFormatter().date(from: $0.created_at) ?? Date()) }
    }

    static func insertCheckin(_ checkin: Checkin, planId: String, userId: String, token: String) async throws {
        let body = InsertCheckin(plan_id: planId, user_id: userId, checkin_date: Formatters.shortDate(checkin.checkinDate), current_net_worth: checkin.currentNetWorth, annual_spending: checkin.annualSpending, note: checkin.note)
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        _ = try await request(path: "/checkins", method: "POST", body: encoder.encode(body), token: token)
    }

    static func updatePlan(_ plan: FirePlan, token: String) async throws {
        let body = UpdatePlan(annual_spending: plan.annualSpending, target_amount: plan.targetAmount, updated_at: ISO8601DateFormatter().string(from: Date()))
        let encoder = JSONEncoder()
        _ = try await request(path: "/fire_plans?id=eq.\(plan.id)", method: "PATCH", body: encoder.encode(body), token: token)
    }
}

// MARK: - Codable rows

private struct ProfileRow: Codable {
    let id: String
    let display_name: String
    let avatar_url: String
    let preferred_language: String
    let preferred_currency: String
}

private struct PlanRow: Codable {
    let id: String
    let user_id: String
    let annual_spending: Double
    let withdrawal_rate: Double
    let target_amount: Double
    let currency: String
    let updated_at: String
}

private struct CheckinRow: Codable {
    let id: String
    let plan_id: String
    let checkin_date: String
    let current_net_worth: Double
    let annual_spending: Double
    let note: String
    let created_at: String
}

private struct InsertCheckin: Codable {
    let plan_id: String
    let user_id: String
    let checkin_date: String
    let current_net_worth: Double
    let annual_spending: Double
    let note: String
}

private struct UpdatePlan: Codable {
    let annual_spending: Double
    let target_amount: Double
    let updated_at: String
}
