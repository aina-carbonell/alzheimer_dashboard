// Real OASIS-1 Alzheimer dataset

export interface Patient {
  id: string;
  age: number;
  gender: 'M' | 'F';
  hand: string;
  education: number | null;
  ses: number | null;
  mmse: number | null;
  cdr: number | null;
  nWBV: number;
  eTIV: number;
  ASF: number;
  delay: string | null;
  diagnosis: 'NonDemented' | 'VeryMildDemented' | 'MildDemented' | 'ModerateDemented';
}

// Parse CSV data
const parseCSV = (csvText: string): Patient[] => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const row: Record<string, string> = {};
    headers.forEach((h, i) => row[h] = values[i] || '');
    
    return {
      id: row['ID'],
      age: parseInt(row['Age']) || 0,
      gender: row['M/F'] as 'M' | 'F',
      hand: row['Hand'],
      education: row['Educ'] ? parseFloat(row['Educ']) : null,
      ses: row['SES'] ? parseFloat(row['SES']) : null,
      mmse: row['MMSE'] ? parseFloat(row['MMSE']) : null,
      cdr: row['CDR'] ? parseFloat(row['CDR']) : null,
      nWBV: parseFloat(row['nWBV']) || 0,
      eTIV: parseFloat(row['eTIV']) || 0,
      ASF: parseFloat(row['ASF']) || 0,
      delay: row['Delay'] || null,
      diagnosis: row['class'] as Patient['diagnosis'],
    };
  }).filter(p => p.id && p.age > 0);
};

// Raw CSV data embedded for immediate use
const csvData = `ID,M/F,Hand,Age,Educ,SES,MMSE,CDR,eTIV,nWBV,ASF,Delay,class
OAS1_0002_MR1,F,R,55,4.0,1.0,29.0,0.0,1147,0.81,1.531,,NonDemented
OAS1_0007_MR1,M,R,21,,,,,1516,0.83,1.157,,NonDemented
OAS1_0009_MR1,F,R,20,,,,,1505,0.843,1.166,,NonDemented
OAS1_0010_MR1,M,R,74,5.0,2.0,30.0,0.0,1636,0.689,1.073,,NonDemented
OAS1_0012_MR1,M,R,30,,,,,1574,0.842,1.115,,NonDemented
OAS1_0013_MR1,F,R,81,5.0,2.0,30.0,0.0,1664,0.679,1.055,,NonDemented
OAS1_0014_MR1,F,R,19,,,,,1525,0.856,1.151,,NonDemented
OAS1_0015_MR1,M,R,76,2.0,,28.0,0.5,1738,0.719,1.01,,VeryMildDemented
OAS1_0023_MR1,M,R,82,2.0,3.0,27.0,0.5,1420,0.71,1.236,,VeryMildDemented
OAS1_0028_MR1,F,R,86,2.0,4.0,27.0,1.0,1449,0.738,1.211,,MildDemented
OAS1_0029_MR1,M,R,21,,,,,1653,0.858,1.062,,NonDemented
OAS1_0031_MR1,M,R,88,1.0,4.0,26.0,1.0,1419,0.674,1.236,,MildDemented
OAS1_0035_MR1,F,R,84,3.0,2.0,28.0,1.0,1402,0.695,1.252,,MildDemented
OAS1_0037_MR1,M,R,27,,,,,1313,0.842,1.336,,NonDemented
OAS1_0039_MR1,M,R,70,4.0,3.0,29.0,0.5,1463,0.772,1.2,,VeryMildDemented
OAS1_0040_MR1,F,R,38,,,,,1244,0.824,1.411,,NonDemented
OAS1_0041_MR1,F,R,62,2.0,,28.0,0.5,1350,0.758,1.3,,VeryMildDemented
OAS1_0046_MR1,M,R,64,2.0,,22.0,0.5,1351,0.787,1.299,,VeryMildDemented
OAS1_0047_MR1,F,R,57,,,,,1408,0.784,1.247,,NonDemented
OAS1_0049_MR1,F,R,20,,,,,1329,0.887,1.321,,NonDemented
OAS1_0051_MR1,F,R,24,,,,,1567,0.835,1.12,,NonDemented
OAS1_0052_MR1,F,R,78,1.0,5.0,23.0,1.0,1462,0.697,1.2,,MildDemented
OAS1_0053_MR1,F,R,83,1.0,4.0,21.0,1.0,1384,0.699,1.268,,MildDemented
OAS1_0054_MR1,F,R,21,,,,,1567,0.848,1.12,,NonDemented
OAS1_0056_MR1,F,R,72,3.0,3.0,15.0,1.0,1324,0.668,1.325,,MildDemented
OAS1_0058_MR1,F,R,46,5.0,1.0,30.0,0.0,1585,0.817,1.107,,NonDemented
OAS1_0059_MR1,F,R,20,,,,,1396,0.827,1.257,,NonDemented
OAS1_0060_MR1,M,R,79,4.0,,29.0,0.5,1564,0.734,1.122,,VeryMildDemented
OAS1_0066_MR1,F,R,66,1.0,4.0,28.0,0.5,1309,0.765,1.341,,VeryMildDemented
OAS1_0070_MR1,F,R,63,3.0,2.0,30.0,0.0,1327,0.801,1.323,,NonDemented
OAS1_0072_MR1,F,R,60,5.0,1.0,30.0,0.0,1402,0.823,1.252,,NonDemented
OAS1_0073_MR1,F,R,69,2.0,4.0,21.0,1.0,1495,0.655,1.174,,MildDemented
OAS1_0080_MR1,F,R,25,,,,,1628,0.857,1.078,,NonDemented
OAS1_0082_MR1,F,R,75,2.0,3.0,28.0,0.5,1407,0.776,1.247,,VeryMildDemented
OAS1_0086_MR1,F,R,47,4.0,1.0,30.0,0.0,1311,0.835,1.339,,NonDemented
OAS1_0087_MR1,F,R,21,,,,,1507,0.845,1.165,,NonDemented
OAS1_0095_MR1,M,R,28,,,,,1578,0.856,1.112,,NonDemented
OAS1_0102_MR1,M,R,18,,,,,1542,0.85,1.138,,NonDemented
OAS1_0104_MR1,F,R,24,,,,,1447,0.841,1.213,,NonDemented
OAS1_0105_MR1,M,R,20,,,,,1512,0.839,1.161,,NonDemented
OAS1_0106_MR1,F,R,81,2.0,4.0,30.0,0.0,1230,0.717,1.427,,NonDemented
OAS1_0109_MR1,F,R,61,4.0,3.0,30.0,0.0,1313,0.813,1.337,,NonDemented
OAS1_0110_MR1,M,R,31,,,,,1452,0.865,1.209,,NonDemented
OAS1_0111_MR1,F,R,76,5.0,1.0,28.0,0.5,1358,0.765,1.292,,VeryMildDemented
OAS1_0117_MR1,F,R,55,5.0,1.0,30.0,0.0,1462,0.817,1.2,,NonDemented
OAS1_0118_MR1,F,R,22,,,,,1504,0.863,1.167,,NonDemented
OAS1_0119_MR1,F,R,33,,,,,1394,0.802,1.26,,NonDemented
OAS1_0122_MR1,M,R,74,5.0,1.0,30.0,0.0,1556,0.761,1.128,,NonDemented
OAS1_0127_MR1,F,R,88,4.0,2.0,30.0,0.5,1296,0.673,1.354,,VeryMildDemented
OAS1_0128_MR1,M,R,19,,,,,1434,0.867,1.224,,NonDemented
OAS1_0129_MR1,F,R,53,5.0,2.0,30.0,0.0,1491,0.844,1.177,,NonDemented
OAS1_0132_MR1,M,R,65,2.0,3.0,27.0,0.5,1529,0.734,1.148,,VeryMildDemented
OAS1_0133_MR1,M,R,77,3.0,3.0,27.0,0.5,1497,0.729,1.172,,VeryMildDemented
OAS1_0135_MR1,F,R,79,2.0,1.0,28.0,0.0,1274,0.72,1.377,,NonDemented
OAS1_0137_MR1,F,R,51,5.0,1.0,30.0,0.0,1399,0.854,1.254,,NonDemented
OAS1_0138_MR1,F,R,77,3.0,1.0,30.0,0.0,1368,0.75,1.283,,NonDemented
OAS1_0139_MR1,F,R,22,,,,,1574,0.874,1.115,,NonDemented
OAS1_0140_MR1,F,R,77,5.0,1.0,28.0,0.0,1334,0.718,1.316,,NonDemented
OAS1_0141_MR1,F,R,23,,,,,1547,0.87,1.134,,NonDemented
OAS1_0142_MR1,F,R,29,,,,,1447,0.815,1.213,,NonDemented
OAS1_0143_MR1,F,R,79,2.0,2.0,29.0,0.0,1396,0.749,1.257,,NonDemented
OAS1_0144_MR1,M,R,22,,,,,1587,0.871,1.106,,NonDemented
OAS1_0146_MR1,F,R,19,,,,,1455,0.867,1.206,,NonDemented
OAS1_0147_MR1,M,R,79,5.0,2.0,29.0,0.0,1662,0.686,1.056,,NonDemented
OAS1_0148_MR1,M,R,82,5.0,2.0,26.0,0.5,1782,0.687,0.985,,VeryMildDemented
OAS1_0149_MR1,F,R,79,3.0,2.0,30.0,0.0,1304,0.737,1.346,,NonDemented
OAS1_0150_MR1,M,R,81,5.0,2.0,26.0,0.5,1612,0.671,1.089,,VeryMildDemented
OAS1_0152_MR1,F,R,26,,,,,1456,0.864,1.205,,NonDemented
OAS1_0153_MR1,F,R,31,,,,,1511,0.839,1.162,,NonDemented
OAS1_0154_MR1,F,R,46,,,,,1362,0.84,1.288,,NonDemented
OAS1_0155_MR1,F,R,21,,,,,1457,0.873,1.204,,NonDemented
OAS1_0159_MR1,F,R,63,4.0,2.0,29.0,0.0,1365,0.811,1.286,,NonDemented
OAS1_0163_MR1,F,R,22,,,,,1542,0.883,1.138,,NonDemented
OAS1_0165_MR1,M,R,61,5.0,1.0,30.0,0.0,1582,0.782,1.109,,NonDemented
OAS1_0169_MR1,F,R,89,2.0,2.0,22.0,0.5,1319,0.696,1.331,,VeryMildDemented
OAS1_0173_MR1,M,R,23,,,,,1701,0.849,1.032,,NonDemented
OAS1_0174_MR1,F,R,80,2.0,2.0,29.0,0.0,1269,0.732,1.383,,NonDemented
OAS1_0175_MR1,M,R,80,5.0,2.0,28.0,0.0,1719,0.707,1.021,,NonDemented
OAS1_0177_MR1,M,R,56,4.0,2.0,30.0,0.0,1589,0.802,1.104,,NonDemented
OAS1_0178_MR1,M,R,23,,,,,1468,0.876,1.196,,NonDemented
OAS1_0179_MR1,M,R,76,5.0,2.0,30.0,0.0,1558,0.724,1.127,,NonDemented
OAS1_0181_MR1,M,R,75,5.0,2.0,28.0,0.5,1820,0.698,0.964,,VeryMildDemented
OAS1_0183_MR1,M,R,77,4.0,2.0,28.0,0.0,1693,0.714,1.037,,NonDemented
OAS1_0184_MR1,M,R,80,5.0,1.0,27.0,0.5,1565,0.693,1.122,,VeryMildDemented
OAS1_0186_MR1,M,R,33,,,,,1538,0.866,1.141,,NonDemented
OAS1_0187_MR1,F,R,27,,,,,1357,0.815,1.294,,NonDemented
OAS1_0188_MR1,F,R,81,3.0,2.0,25.0,1.0,1382,0.651,1.27,,MildDemented
OAS1_0189_MR1,F,R,26,,,,,1529,0.871,1.148,,NonDemented
OAS1_0191_MR1,F,R,79,2.0,2.0,28.0,0.5,1328,0.715,1.322,,VeryMildDemented
OAS1_0193_MR1,F,R,80,4.0,1.0,30.0,0.0,1288,0.748,1.362,,NonDemented
OAS1_0197_MR1,F,R,28,,,,,1457,0.815,1.204,,NonDemented
OAS1_0199_MR1,F,R,63,4.0,3.0,30.0,0.0,1421,0.801,1.235,,NonDemented
OAS1_0200_MR1,M,R,58,5.0,2.0,29.0,0.0,1546,0.789,1.135,,NonDemented
OAS1_0206_MR1,F,R,30,,,,,1361,0.834,1.29,,NonDemented
OAS1_0209_MR1,M,R,74,5.0,1.0,30.0,0.0,1664,0.758,1.055,,NonDemented
OAS1_0211_MR1,M,R,24,,,,,1596,0.873,1.099,,NonDemented
OAS1_0214_MR1,F,R,57,,,,,1321,0.838,1.329,,NonDemented
OAS1_0215_MR1,F,R,32,,,,,1399,0.839,1.254,,NonDemented
OAS1_0218_MR1,F,R,60,5.0,2.0,30.0,0.0,1483,0.835,1.183,,NonDemented
OAS1_0219_MR1,F,R,74,3.0,2.0,29.0,0.0,1263,0.759,1.39,,NonDemented
OAS1_0220_MR1,F,R,69,3.0,2.0,29.0,0.5,1478,0.773,1.188,,VeryMildDemented
OAS1_0224_MR1,M,R,28,,,,,1569,0.879,1.119,,NonDemented
OAS1_0225_MR1,M,R,52,5.0,2.0,30.0,0.0,1665,0.792,1.054,,NonDemented
OAS1_0230_MR1,M,R,78,4.0,3.0,29.0,0.0,1559,0.712,1.126,,NonDemented
OAS1_0232_MR1,M,R,26,,,,,1459,0.874,1.203,,NonDemented
OAS1_0235_MR1,M,R,87,4.0,2.0,29.0,0.5,1565,0.685,1.121,,VeryMildDemented
OAS1_0236_MR1,M,R,24,,,,,1603,0.877,1.095,,NonDemented
OAS1_0239_MR1,F,R,85,3.0,3.0,23.0,1.0,1402,0.705,1.252,,MildDemented
OAS1_0244_MR1,M,R,19,,,,,1564,0.863,1.122,,NonDemented
OAS1_0245_MR1,F,R,61,4.0,1.0,30.0,0.0,1487,0.819,1.18,,NonDemented
OAS1_0248_MR1,F,R,78,3.0,1.0,30.0,0.0,1439,0.735,1.22,,NonDemented
OAS1_0251_MR1,M,R,29,,,,,1666,0.858,1.053,,NonDemented
OAS1_0256_MR1,F,R,74,3.0,2.0,27.0,0.5,1275,0.724,1.376,,VeryMildDemented
OAS1_0262_MR1,F,R,66,2.0,3.0,30.0,0.0,1392,0.803,1.261,,NonDemented
OAS1_0265_MR1,M,R,27,,,,,1700,0.856,1.033,,NonDemented
OAS1_0266_MR1,F,R,30,,,,,1432,0.85,1.226,,NonDemented
OAS1_0268_MR1,M,R,91,2.0,2.0,20.0,1.0,1649,0.699,1.064,,MildDemented
OAS1_0269_MR1,F,R,62,3.0,2.0,29.0,0.0,1349,0.806,1.301,,NonDemented
OAS1_0270_MR1,M,R,22,,,,,1606,0.862,1.093,,NonDemented
OAS1_0271_MR1,F,R,22,,,,,1386,0.845,1.266,,NonDemented
OAS1_0272_MR1,F,R,50,5.0,2.0,30.0,0.0,1339,0.854,1.311,,NonDemented
OAS1_0273_MR1,F,R,89,3.0,2.0,29.0,0.5,1217,0.699,1.442,,VeryMildDemented
OAS1_0275_MR1,M,R,80,5.0,2.0,29.0,0.5,1545,0.717,1.136,,VeryMildDemented
OAS1_0276_MR1,F,R,62,4.0,2.0,30.0,0.0,1295,0.805,1.355,,NonDemented
OAS1_0277_MR1,M,R,31,,,,,1523,0.867,1.152,,NonDemented
OAS1_0278_MR1,F,R,24,,,,,1453,0.851,1.208,,NonDemented
OAS1_0280_MR1,F,R,62,5.0,1.0,30.0,0.0,1360,0.818,1.29,,NonDemented
OAS1_0282_MR1,M,R,25,,,,,1539,0.874,1.14,,NonDemented
OAS1_0285_MR1,M,R,75,3.0,2.0,29.0,0.0,1631,0.73,1.076,,NonDemented
OAS1_0286_MR1,M,R,82,3.0,2.0,30.0,0.0,1645,0.69,1.067,,NonDemented
OAS1_0287_MR1,F,R,29,,,,,1364,0.868,1.287,,NonDemented
OAS1_0295_MR1,M,R,31,,,,,1694,0.848,1.036,,NonDemented
OAS1_0297_MR1,F,R,18,,,,,1424,0.871,1.232,,NonDemented
OAS1_0298_MR1,F,R,26,,,,,1447,0.858,1.213,,NonDemented
OAS1_0299_MR1,M,R,85,2.0,2.0,26.0,0.5,1655,0.692,1.06,,VeryMildDemented
OAS1_0300_MR1,F,R,68,4.0,1.0,30.0,0.0,1379,0.789,1.273,,NonDemented
OAS1_0301_MR1,M,R,20,,,,,1680,0.852,1.044,,NonDemented
OAS1_0304_MR1,M,R,24,,,,,1617,0.846,1.085,,NonDemented
OAS1_0305_MR1,F,R,28,,,,,1529,0.832,1.148,,NonDemented
OAS1_0311_MR1,M,R,22,,,,,1663,0.885,1.055,,NonDemented
OAS1_0313_MR1,M,R,69,4.0,1.0,29.0,0.0,1561,0.778,1.124,,NonDemented
OAS1_0314_MR1,F,R,82,2.0,2.0,28.0,0.5,1277,0.719,1.374,,VeryMildDemented
OAS1_0315_MR1,M,R,24,,,,,1684,0.866,1.042,,NonDemented
OAS1_0316_MR1,F,R,49,,,,,1341,0.833,1.309,,NonDemented
OAS1_0317_MR1,F,R,24,,,,,1388,0.85,1.264,,NonDemented
OAS1_0319_MR1,F,R,20,,,,,1529,0.857,1.148,,NonDemented
OAS1_0321_MR1,F,R,20,,,,,1408,0.866,1.246,,NonDemented
OAS1_0323_MR1,M,R,79,3.0,2.0,30.0,0.0,1497,0.709,1.172,,NonDemented
OAS1_0331_MR1,M,R,89,3.0,2.0,28.0,0.5,1521,0.706,1.154,,VeryMildDemented
OAS1_0332_MR1,M,R,27,,,,,1621,0.864,1.083,,NonDemented
OAS1_0333_MR1,F,R,20,,,,,1455,0.871,1.206,,NonDemented
OAS1_0334_MR1,F,R,18,,,,,1449,0.879,1.212,,NonDemented
OAS1_0337_MR1,M,R,59,5.0,1.0,29.0,0.0,1645,0.786,1.067,,NonDemented
OAS1_0340_MR1,F,R,86,2.0,2.0,26.0,0.5,1404,0.694,1.25,,VeryMildDemented
OAS1_0341_MR1,F,R,67,3.0,2.0,30.0,0.0,1415,0.784,1.24,,NonDemented
OAS1_0342_MR1,F,R,71,3.0,2.0,28.0,0.5,1324,0.747,1.326,,VeryMildDemented
OAS1_0343_MR1,M,R,66,2.0,3.0,25.0,1.0,1457,0.727,1.204,,MildDemented
OAS1_0344_MR1,F,R,59,5.0,1.0,29.0,0.0,1449,0.808,1.211,,NonDemented
OAS1_0345_MR1,F,R,23,,,,,1528,0.85,1.149,,NonDemented
OAS1_0352_MR1,F,R,19,,,,,1417,0.877,1.238,,NonDemented
OAS1_0353_MR1,F,R,24,,,,,1516,0.849,1.158,,NonDemented
OAS1_0354_MR1,M,R,85,4.0,2.0,29.0,0.5,1458,0.681,1.204,,VeryMildDemented
OAS1_0356_MR1,M,R,87,3.0,2.0,26.0,0.5,1475,0.703,1.19,,VeryMildDemented
OAS1_0357_MR1,M,R,86,5.0,2.0,29.0,0.5,1512,0.677,1.161,,VeryMildDemented
OAS1_0361_MR1,F,R,65,4.0,1.0,30.0,0.0,1337,0.778,1.312,,NonDemented
OAS1_0363_MR1,M,R,44,5.0,2.0,30.0,0.0,1587,0.798,1.106,,NonDemented
OAS1_0364_MR1,M,R,20,,,,,1611,0.878,1.089,,NonDemented
OAS1_0365_MR1,F,R,45,5.0,2.0,30.0,0.0,1544,0.84,1.136,,NonDemented
OAS1_0368_MR1,F,R,55,5.0,1.0,30.0,0.0,1415,0.828,1.24,,NonDemented
OAS1_0369_MR1,F,R,46,3.0,3.0,30.0,0.0,1450,0.826,1.21,,NonDemented
OAS1_0371_MR1,F,R,87,2.0,3.0,18.0,1.0,1252,0.681,1.402,,MildDemented
OAS1_0373_MR1,F,R,74,4.0,2.0,29.0,0.0,1352,0.757,1.298,,NonDemented
OAS1_0375_MR1,F,R,19,,,,,1428,0.866,1.229,,NonDemented
OAS1_0378_MR1,M,R,22,,,,,1688,0.858,1.039,,NonDemented
OAS1_0379_MR1,M,R,19,,,,,1672,0.841,1.049,,NonDemented
OAS1_0380_MR1,F,R,22,,,,,1352,0.858,1.298,,NonDemented
OAS1_0381_MR1,F,R,71,4.0,2.0,28.0,0.5,1428,0.77,1.229,,VeryMildDemented
OAS1_0383_MR1,M,R,60,5.0,1.0,30.0,0.0,1539,0.784,1.14,,NonDemented
OAS1_0384_MR1,M,R,61,5.0,2.0,30.0,0.0,1620,0.785,1.083,,NonDemented
OAS1_0386_MR1,F,R,70,4.0,1.0,30.0,0.0,1389,0.78,1.264,,NonDemented
OAS1_0390_MR1,F,R,21,,,,,1410,0.87,1.244,,NonDemented
OAS1_0391_MR1,F,R,23,,,,,1486,0.868,1.181,,NonDemented
OAS1_0393_MR1,M,R,66,5.0,2.0,30.0,0.0,1586,0.804,1.106,,NonDemented
OAS1_0394_MR1,F,R,22,,,,,1491,0.855,1.177,,NonDemented
OAS1_0396_MR1,F,R,68,5.0,1.0,29.0,0.0,1409,0.805,1.245,,NonDemented
OAS1_0397_MR1,M,R,23,,,,,1608,0.869,1.091,,NonDemented
OAS1_0402_MR1,F,R,18,,,,,1426,0.873,1.231,,NonDemented
OAS1_0404_MR1,F,R,78,4.0,1.0,30.0,0.0,1338,0.743,1.312,,NonDemented
OAS1_0411_MR1,F,R,67,4.0,2.0,30.0,0.0,1301,0.794,1.349,,NonDemented
OAS1_0413_MR1,F,R,32,,,,,1355,0.849,1.295,,NonDemented
OAS1_0414_MR1,F,R,67,4.0,1.0,29.0,0.0,1433,0.789,1.225,,NonDemented
OAS1_0416_MR1,M,R,24,,,,,1562,0.85,1.123,,NonDemented
OAS1_0417_MR1,F,R,67,3.0,2.0,29.0,0.0,1432,0.755,1.225,,NonDemented
OAS1_0418_MR1,M,R,69,5.0,1.0,30.0,0.0,1539,0.784,1.14,,NonDemented
OAS1_0421_MR1,M,R,78,3.0,2.0,30.0,0.0,1538,0.747,1.141,,NonDemented
OAS1_0429_MR1,M,R,76,3.0,2.0,30.0,0.0,1489,0.707,1.179,,NonDemented
OAS1_0430_MR1,M,R,25,,,,,1546,0.875,1.135,,NonDemented
OAS1_0431_MR1,F,R,72,4.0,2.0,30.0,0.0,1476,0.802,1.189,,NonDemented
OAS1_0432_MR1,F,R,23,,,,,1455,0.853,1.206,,NonDemented
OAS1_0433_MR1,F,R,54,5.0,1.0,30.0,0.0,1475,0.837,1.19,,NonDemented
OAS1_0434_MR1,F,R,60,5.0,1.0,29.0,0.0,1507,0.804,1.165,,NonDemented
OAS1_0435_MR1,M,R,21,,,,,1685,0.867,1.041,,NonDemented
OAS1_0436_MR1,F,R,87,2.0,2.0,21.0,1.0,1443,0.666,1.216,,MildDemented`;

export const patients = parseCSV(csvData);

export const datasetInfo = {
  name: "OASIS-1",
  fullName: "Open Access Series of Imaging Studies",
  description: "Dataset de neuroimatge transversal amb 192 subjectes d'entre 18 i 96 anys, incloent pacients amb diversos graus de demència i controls sans.",
  source: "Washington University",
  variables: [
    { name: "Age", description: "Edat del pacient en anys", type: "Quantitativa" },
    { name: "M/F", description: "Gènere (Masculí/Femení)", type: "Categòrica" },
    { name: "Educ", description: "Anys d'educació formal (1-5 escala)", type: "Ordinal" },
    { name: "SES", description: "Estat socioeconòmic (1-5)", type: "Ordinal" },
    { name: "MMSE", description: "Mini-Mental State Examination (0-30)", type: "Quantitativa" },
    { name: "CDR", description: "Clinical Dementia Rating (0, 0.5, 1, 2)", type: "Ordinal" },
    { name: "nWBV", description: "Volum cerebral normalitzat", type: "Quantitativa" },
    { name: "eTIV", description: "Volum intracranial total estimat (mm³)", type: "Quantitativa" },
  ],
};

// Mapping for display names
export const diagnosisLabels: Record<Patient['diagnosis'], string> = {
  NonDemented: "Sense demència",
  VeryMildDemented: "Demència Molt Lleu",
  MildDemented: "Demència Lleu",
  ModerateDemented: "Demència Moderada",
};

// Aggregate data for charts
export const getGenderDiagnosisData = () => {
  const diagnoses: Patient['diagnosis'][] = ['NonDemented', 'VeryMildDemented', 'MildDemented'];
  
  return diagnoses.map(diagnosis => {
    const male = patients.filter(p => p.diagnosis === diagnosis && p.gender === 'M').length;
    const female = patients.filter(p => p.diagnosis === diagnosis && p.gender === 'F').length;
    return { 
      diagnosis: diagnosisLabels[diagnosis], 
      male, 
      female 
    };
  });
};

export const getEducationDiagnosisData = () => {
  const patientsWithEduc = patients.filter(p => p.education !== null);
  
  const educationLevels = [
    { label: 'Baix (1-2)', min: 1, max: 2 },
    { label: 'Mitjà (3)', min: 3, max: 3 },
    { label: 'Alt (4-5)', min: 4, max: 5 },
  ];
  
  return educationLevels.map(level => {
    const levelPatients = patientsWithEduc.filter(p => p.education! >= level.min && p.education! <= level.max);
    const total = levelPatients.length || 1;
    
    return {
      education: level.label,
      "Sense demència": Math.round((levelPatients.filter(p => p.diagnosis === 'NonDemented').length / total) * 100),
      "Molt Lleu": Math.round((levelPatients.filter(p => p.diagnosis === 'VeryMildDemented').length / total) * 100),
      "Lleu": Math.round((levelPatients.filter(p => p.diagnosis === 'MildDemented').length / total) * 100),
    };
  });
};

export const getAgeTrendData = () => {
  const ageGroups = [
    { label: '18-39', min: 18, max: 39 },
    { label: '40-59', min: 40, max: 59 },
    { label: '60-69', min: 60, max: 69 },
    { label: '70-79', min: 70, max: 79 },
    { label: '80+', min: 80, max: 100 },
  ];
  
  return ageGroups.map(group => {
    const groupPatients = patients.filter(p => p.age >= group.min && p.age <= group.max);
    const withMMSE = groupPatients.filter(p => p.mmse !== null);
    const avgMMSE = withMMSE.length > 0 
      ? withMMSE.reduce((sum, p) => sum + p.mmse!, 0) / withMMSE.length 
      : null;
    const avgNWBV = groupPatients.reduce((sum, p) => sum + p.nWBV, 0) / groupPatients.length || 0;
    const dementiaRate = (groupPatients.filter(p => p.diagnosis !== 'NonDemented').length / groupPatients.length) * 100 || 0;
    
    return {
      ageGroup: group.label,
      mmse: avgMMSE ? Math.round(avgMMSE * 10) / 10 : null,
      nWBV: Math.round(avgNWBV * 1000) / 1000,
      dementiaRate: Math.round(dementiaRate),
      count: groupPatients.length,
    };
  });
};

export const getScatterData = () => {
  return patients
    .filter(p => p.mmse !== null)
    .map(p => ({
      nWBV: p.nWBV,
      mmse: p.mmse!,
      diagnosis: diagnosisLabels[p.diagnosis],
      age: p.age,
      gender: p.gender,
      id: p.id,
    }));
};
