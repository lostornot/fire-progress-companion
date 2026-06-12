import SwiftUI

struct QuickCalcView: View {
    @Environment(AppStore.self) var store
    @State private var annualSpending: Double = 180000
    @State private var currentNetWorth: Double = 1650000
    @State private var withdrawalRate: Double = 4

    var metrics: FireMetrics {
        FireCalculator.calculate(annualSpending: annualSpending, currentNetWorth: currentNetWorth, withdrawalRate: withdrawalRate)
    }

    var body: some View {
        VStack(spacing: 16) {
            Text("FIRE")
                .font(.title2.bold())

            HStack(spacing: 12) {
                calcField(store.t("annualSpending"), value: $annualSpending)
                calcField(store.t("currentNetWorth"), value: $currentNetWorth)
                calcField(store.t("withdrawalRate"), value: $withdrawalRate)
            }

            HStack(spacing: 12) {
                metricCard(store.t("target"), value: Formatters.currency(metrics.targetAmount, currency: store.settings.currency, lang: store.lang))
                metricCard(store.t("progress"), value: Formatters.percent(metrics.progress, lang: store.lang))
                metricCard(store.t("gap"), value: Formatters.currency(metrics.gap, currency: store.settings.currency, lang: store.lang))
            }
        }
        .padding()
        .background(.gray.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 24))
        .padding(.horizontal)
    }

    private func calcField(_ label: String, value: Binding<Double>) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            TextField("", value: value, format: .number)
                .textFieldStyle(.roundedBorder)
                .keyboardType(.decimalPad)
        }
    }

    private func metricCard(_ label: String, value: String) -> some View {
        VStack(spacing: 4) {
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.headline)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(.white)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
