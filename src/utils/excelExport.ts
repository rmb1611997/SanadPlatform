import * as XLSX from 'xlsx';

export interface ExcelColumnDefinition<T> {
  header: string;
  key: keyof T | ((item: T) => any);
}

export const exportToExcel = <T>(
  data: T[],
  columns: ExcelColumnDefinition<T>[],
  fileName: string
) => {
  // Map data to the correct format
  const worksheetData = data.map((item) => {
    const row: any = {};
    columns.forEach((col) => {
      row[col.header] = typeof col.key === 'function' ? col.key(item) : item[col.key];
    });
    return row;
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(worksheetData);

  // Set auto-width (simple estimation)
  const colWidths = columns.map(col => ({ wch: col.header.length + 5 }));
  worksheet['!cols'] = colWidths;

  // Set auto filter
  worksheet['!autofilter'] = { ref: XLSX.utils.encode_range(XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1')) };

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Export
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
