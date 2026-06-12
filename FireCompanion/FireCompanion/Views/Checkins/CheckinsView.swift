import SwiftUI

struct CheckinsView: View {
    @Environment(AppStore.self) var store
    @State private var date = Date()
    @State private var netWorth: Double = 1750000
    @State private var spending: Double = 180000
    @State private var note = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    addForm
                    historySection
                }
                .padding()
            }
            .navigationTitle(store.t("checkins"))
        }
    }

    private var addForm: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(store.t("addCheckin"))
                .font(.title3.bold())

            DatePicker(store.t("checkinDate"), selection: $date, displayedComponents: .date)
            fieldRow(store.t("currentNetWorth"), value: $netWorth)
            fieldRow(store.t("annualSpending"), value: $spending)
            fieldRow(store.t("note"), text: $note)

            Button {
                store.addCheckin(date: date, netWorth: netWorth, spending: spending, note: note)
                note = ""
            } label: {
                Text(store.t("saveCheckin"))
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color.accentColor)
                    .foregroundStyle(.white)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
            }
        }
        .padding()
        .background(.gray.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }

    private var historySection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text(store.t("history"))
                .font(.title3.bold())

            if store.sortedCheckins.isEmpty {
                Text(store.t("noCheckins"))
                    .foregroundStyle(.secondary)
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding()
            } else {
                ForEach(store.sortedCheckins.reversed()) { c in
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(Formatters.shortDate(c.checkinDate))
                                .font(.headline)
                            let noteKey = c.note
                            let translated = store.dict[noteKey] ?? noteKey
                            Text(translated.isEmpty ? store.t("noNote") : translated)
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                        Spacer()
                        Text(Formatters.currency(c.currentNetWorth, currency: store.settings.currency, lang: store.lang))
                            .font(.headline)
                    }
                    .padding()
                    .background(.gray.opacity(0.08))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
        }
    }

    private func fieldRow(_ label: String, value: Binding<Double>) -> some View {
        HStack {
            Text(label)
                .frame(width: 100, alignment: .leading)
            TextField("", value: value, format: .number)
                .textFieldStyle(.roundedBorder)
                .keyboardType(.decimalPad)
        }
    }

    private func fieldRow(_ label: String, text: Binding<String>) -> some View {
        HStack {
            Text(label)
                .frame(width: 100, alignment: .leading)
            TextField(store.t("optionalNote"), text: text)
                .textFieldStyle(.roundedBorder)
        }
    }
}
