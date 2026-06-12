import SwiftUI
import Charts

struct DashboardView: View {
    @Environment(AppStore.self) var store
    @Environment(\.horizontalSizeClass) var sizeClass

    private var columns: [GridItem] {
        sizeClass == .compact
            ? [GridItem(.adaptive(minimum: 150))]
            : [GridItem(.adaptive(minimum: 200))]
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                summaryCards
                if sizeClass == .regular {
                    HStack(alignment: .top, spacing: 24) {
                        chartSection
                            .frame(maxWidth: .infinity)
                        progressRing
                            .frame(width: 220)
                    }
                } else {
                    chartSection
                    progressRing
                }
                milestonesSection
            }
            .padding()
        }
        .navigationTitle(store.t("dashboard"))
    }

    private var summaryCards: some View {
        let m = store.metrics
        let items: [(String, String)] = [
            (store.t("target"), Formatters.currency(m.targetAmount, currency: store.settings.currency, lang: store.lang)),
            (store.t("currentNetWorth"), Formatters.currency(store.sortedCheckins.last?.currentNetWorth ?? 0, currency: store.settings.currency, lang: store.lang)),
            (store.t("progress"), Formatters.percent(m.progress, lang: store.lang)),
            (store.t("gap"), Formatters.currency(m.gap, currency: store.settings.currency, lang: store.lang)),
        ]
        return LazyVGrid(columns: columns, spacing: 12) {
            ForEach(items, id: \.0) { label, value in
                VStack(alignment: .leading, spacing: 4) {
                    Text(label)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(value)
                        .font(.title3.bold())
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                .background(.gray.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 16))
            }
        }
    }

    private var chartSection: some View {
        let data = store.sortedCheckins.map { (Formatters.shortDate($0.checkinDate), $0.currentNetWorth) }
        return VStack(alignment: .leading, spacing: 8) {
            Text(store.t("assetTrend"))
                .font(.title3.bold())
            Text(store.t("assetTrendDesc"))
                .font(.caption)
                .foregroundStyle(.secondary)
            Chart {
                ForEach(Array(data.enumerated()), id: \.offset) { _, item in
                    LineMark(x: .value("Date", item.0), y: .value("Net Worth", item.1))
                        .foregroundStyle(Color.accentColor)
                        .interpolationMethod(.monotone)
                    AreaMark(x: .value("Date", item.0), y: .value("Net Worth", item.1))
                        .foregroundStyle(Color.accentColor.opacity(0.1))
                }
            }
            .frame(height: sizeClass == .regular ? 280 : 200)
            .chartXAxis { AxisMarks(values: .automatic) }
        }
        .padding()
        .background(.gray.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var progressRing: some View {
        let progress = min(store.metrics.progress, 1.0)
        return VStack(spacing: 12) {
            ZStack {
                Circle()
                    .stroke(.gray.opacity(0.15), lineWidth: 20)
                Circle()
                    .trim(from: 0, to: progress)
                    .stroke(Color.accentColor, style: StrokeStyle(lineWidth: 20, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                    .animation(.easeInOut(duration: 0.8), value: progress)
                VStack(spacing: 4) {
                    Text(store.t("currentProgress"))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text(Formatters.percent(progress, lang: store.lang))
                        .font(.title2.bold())
                }
            }
            .frame(width: 180, height: 180)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(.gray.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var milestonesSection: some View {
        let milestones = FireCalculator.milestones(progress: store.metrics.progress)
        return LazyVGrid(columns: [GridItem(.adaptive(minimum: 100))], spacing: 12) {
            ForEach(milestones, id: \.label) { m in
                VStack(spacing: 4) {
                    Text(store.t("milestone"))
                        .font(.caption2)
                        .foregroundStyle(.secondary)
                    Text(m.label)
                        .font(.title2.bold())
                    Text(m.reached ? store.t("reached") : store.t("inProgress"))
                        .font(.caption)
                        .foregroundStyle(m.reached ? .green : .secondary)
                }
                .frame(maxWidth: .infinity)
                .padding()
                .background(m.reached ? Color.green.opacity(0.1) : Color.gray.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(m.reached ? Color.green.opacity(0.3) : Color.clear, lineWidth: 1)
                )
            }
        }
    }
}
