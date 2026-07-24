/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';

const publicDir = './public/FINAL REPORT';
const outputFilePath = './src/data/reportData.json';

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    // Handle mismatched columns (e.g. empty line or trailing spaces)
    if (values.length < headers.length) continue;

    const row = {};
    headers.forEach((h, index) => {
      row[h] = values[index] || '';
    });
    rows.push(row);
  }
  return rows;
}

function getCSVFiles() {
  const files = fs.readdirSync(publicDir);
  const result = {};

  files.forEach(file => {
    if (file.endsWith('.csv') && file.includes('Report_contentbank_')) {
      const match = file.match(/Report_contentbank_(\w+)\.csv/);
      if (match) {
        const key = match[1]; // e.g. activities, combinationbank, rolebank, etc.
        const fullPath = path.join(publicDir, file);
        const content = fs.readFileSync(fullPath, 'utf-8');
        result[key] = parseCSV(content);
        console.log(`Parsed ${file} (${result[key].length} rows)`);
      }
    }
  });

  return result;
}

try {
  console.log('Starting CSV contentbank parsing...');
  const data = getCSVFiles();

  // Re-organize rolebank as an object keyed by role_id for faster lookup
  if (data.rolebank) {
    const rolebankObj = {};
    data.rolebank.forEach(row => {
      if (row.role_id) {
        rolebankObj[row.role_id] = row;
      }
    });
    data.rolebank = rolebankObj;
  }

  // Re-organize combinationbank as an object keyed by profile_id for faster lookup
  if (data.combinationbank) {
    const combinationbankObj = {};
    data.combinationbank.forEach(row => {
      if (row.profile_id) {
        combinationbankObj[row.profile_id] = row;
      }
    });
    data.combinationbank = combinationbankObj;
  }

  fs.writeFileSync(outputFilePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Successfully parsed all content banks and saved to: ${outputFilePath}`);
} catch (e) {
  console.error('Error parsing report CSVs:', e);
  process.exit(1);
}
