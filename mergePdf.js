const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

const mergePDFs = async (pdfAPath, pdfBPath, pdfCPath, mergedPDFPath) => {
  try {
    const mergedPdf = await PDFDocument.create();
  
    const pdfA = await PDFDocument.load(fs.readFileSync(pdfAPath));
    const pdfB = await PDFDocument.load(fs.readFileSync(pdfBPath));
    const pdfC = await PDFDocument.load(fs.readFileSync(pdfCPath));
  
    const copiedPagesA = await mergedPdf.copyPages(pdfA, pdfA.getPageIndices());
    copiedPagesA.forEach((page) => mergedPdf.addPage(page));
  
    const copiedPagesB = await mergedPdf.copyPages(pdfB, pdfB.getPageIndices());
    copiedPagesB.forEach((page) => mergedPdf.addPage(page));
  
    const copiedPagesC = await mergedPdf.copyPages(pdfC, pdfC.getPageIndices());
    copiedPagesC.forEach((page) => mergedPdf.addPage(page));
  
    const mergedPdfBytes = await mergedPdf.save();
  
    fs.writeFileSync(mergedPDFPath, mergedPdfBytes);
  
    console.log('PDF files merged successfully!');
  } catch (error) {
    console.log('An error occurred while merging PDF files:', error);
  }
};

const pdfAPath = 'playwrightDocsPt2.pdf';
const pdfBPath = 'playwrightDocsPt3.pdf';
const pdfCPath = 'playwrightDocsPt4.pdf';
const mergedPDFPath = 'playWrightComplete.pdf';

mergePDFs(pdfAPath, pdfBPath, pdfCPath, mergedPDFPath);
