/**
 * Server-side CSV generator with proper escaping and Excel compatibility
 */

export interface CsvColumn {
  key: string;
  label: string;
}

export interface CsvOptions {
  filename: string;
  columns: CsvColumn[];
  data: Record<string, unknown>[];
}

/**
 * Escape a value for CSV format
 * Handles commas, quotes, newlines, and null/undefined values
 */
function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  let str = String(value);

  // Escape double quotes by doubling them
  str = str.replace(/"/g, '""');

  // Wrap in quotes if contains comma, quote, or newline
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str}"`;
  }

  return str;
}

/**
 * Generate CSV content from columns and data
 */
export function generateCsv(columns: CsvColumn[], data: Record<string, unknown>[]): string {
  // BOM for Excel UTF-8 compatibility
  const BOM = '\uFEFF';

  // Header row
  const headers = columns.map(col => escapeCsvValue(col.label)).join(',');

  // Data rows
  const rows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      return escapeCsvValue(value);
    }).join(',');
  });

  return BOM + headers + '\n' + rows.join('\n');
}

/**
 * Generate CSV and return as Response with proper headers for download
 */
export function createCsvResponse(columns: CsvColumn[], data: Record<string, unknown>[], filename: string): Response {
  const csvContent = generateCsv(columns, data);
  const encodedFilename = encodeURIComponent(filename);

  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv;charset=utf-8;',
      'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
    },
  });
}

/**
 * Generate filename with entity name and today's date
 */
export function generateCsvFilename(entity: string): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return `senzaluce-${entity}-${today}.csv`;
}
