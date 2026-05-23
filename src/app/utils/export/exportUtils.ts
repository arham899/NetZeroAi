import { HistoryEntry } from "../../types/calculatorTypes";

/**
 * Exports calculation history to a CSV file
 */
export const exportHistoryToCSV = (history: HistoryEntry[]) => {
    if (history.length === 0) return;

    const headers = ["ID", "Date", "Total (kg CO2e)", "Transport (kg)", "Energy (kg)", "Consumption (kg)", "Waste (kg)", "Type"];

    const rows = history.map(entry => [
        entry.id,
        new Date(entry.date).toLocaleString(),
        entry.totalKg.toFixed(2),
        entry.breakdown.transport.toFixed(2),
        entry.breakdown.energy.toFixed(2),
        entry.breakdown.consumption.toFixed(2),
        entry.breakdown.waste.toFixed(2),
        entry.isQuick ? "Quick" : "Detailed"
    ]);

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Carbon_Calculator_History_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
