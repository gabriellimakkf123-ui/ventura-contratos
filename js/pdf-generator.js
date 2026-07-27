/**
 * Ventura PDF Generator — Design Premium
 * Gera contratos elegantes em PDF com marca d'água, cabeçalho com logo, linhas decorativas e rodapé.
 */

const VenturaPDF = {
  /**
   * Gera um PDF a partir de blocos de conteúdo e opção de categoria para selecionar a logo
   * @param {Array} blocks - Array de blocos de conteúdo do template
   * @param {string} filename - Nome do arquivo PDF
   * @param {string} category - 'atv' ou 'nautico'
   */
  generate: function(blocks, filename, category) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Configurações de layout e margens
    const config = {
      marginLeft: 22,
      marginRight: 22,
      marginTop: 35, // Espaço reforçado para o cabeçalho com logo
      marginBottom: 20,
      pageWidth: 210,
      pageHeight: 297
    };

    const contentWidth = config.pageWidth - config.marginLeft - config.marginRight;
    let cursorY = config.marginTop;
    let pageNum = 1;

    // Cores da marca
    const primaryColor = [10, 22, 40];   // #0A1628 - Azul escuro nobre
    const goldColor = [212, 168, 83];    // #D4A853 - Dourado Ventura
    const grayColor = [100, 110, 125];   // Cinza discreto para linhas e rodapés

    // Selecionar Logo baseada na categoria
    let logoData = null;
    let logoFormat = 'PNG';

    if (window.VenturaLogos) {
      if (category === 'nautico') {
        if (window.VenturaLogos.marineJpg) {
          logoData = window.VenturaLogos.marineJpg;
          logoFormat = 'JPEG';
        } else {
          logoData = window.VenturaLogos.marine;
          logoFormat = 'PNG';
        }
      } else {
        logoData = window.VenturaLogos.experience;
        logoFormat = 'PNG';
      }
    }

    // Desenha o cabeçalho decorativo com a Logo e a borda superior
    function drawHeader() {
      // Borda decorativa no topo da página
      doc.setFillColor(goldColor[0], goldColor[1], goldColor[2]);
      doc.rect(0, 0, config.pageWidth, 3, 'F'); // Barra dourada no topo 3mm

      // Adicionar a Logo no canto superior esquerdo com tratamento robusto
      if (logoData) {
        try {
          if (category === 'nautico') {
            doc.addImage(logoData, logoFormat, config.marginLeft, 6, 25, 20);
          } else {
            doc.addImage(logoData, 'PNG', config.marginLeft, 8, 38, 14);
          }
        } catch (e) {
          console.warn('Nota: Logo não pôde ser renderizada no PDF:', e);
        }
      }

      // Texto de topo / Identificação à direita
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      const headerTitle = category === 'nautico' ? 'VENTURA MARINE' : 'VENTURA EXPERIENCE';
      doc.text(headerTitle, config.pageWidth - config.marginRight, 12, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.text('Documento Oficial de Compra e Venda', config.pageWidth - config.marginRight, 16, { align: 'right' });

      // Linha separadora elegante abaixo do cabeçalho
      doc.setDrawColor(220, 225, 230);
      doc.setLineWidth(0.4);
      doc.line(config.marginLeft, 28, config.pageWidth - config.marginRight, 28);
    }

    // Desenha o rodapé com número de página e termo de autenticidade
    function drawFooter(currentPage, totalPages) {
      const footerY = config.pageHeight - 12;
      doc.setDrawColor(230, 235, 240);
      doc.setLineWidth(0.3);
      doc.line(config.marginLeft, footerY - 4, config.pageWidth - config.marginRight, footerY - 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      const footerBrand = category === 'nautico' ? 'Ventura Marine' : 'Ventura Experience';
      doc.text(`${footerBrand} — Excelência e Rigor Jurídico`, config.marginLeft, footerY);
      
      const pageText = `Página ${currentPage} de ${totalPages}`;
      doc.text(pageText, config.pageWidth - config.marginRight, footerY, { align: 'right' });
    }

    // Função para verificar se precisa de nova página
    function checkPageBreak(neededHeight) {
      if (cursorY + neededHeight > config.pageHeight - config.marginBottom) {
        doc.addPage();
        pageNum++;
        cursorY = config.marginTop;
        drawHeader();
        return true;
      }
      return false;
    }

    // Função para adicionar texto com formatação refinada e segura
    function addText(text, options) {
      const {
        bold = false,
        size = 10,
        align = 'left',
        spaceAfter = 3,
        color = primaryColor
      } = options;

      const safeText = String(text || '');

      doc.setFontSize(size);
      doc.setFont('times', bold ? 'bold' : 'normal');
      doc.setTextColor(color[0], color[1], color[2]);

      const maxWidth = contentWidth;
      const lines = doc.splitTextToSize(safeText, maxWidth);
      const lineHeight = size * 0.45; // mm por linha

      const totalHeight = lines.length * lineHeight + spaceAfter;
      checkPageBreak(totalHeight);

      let x = config.marginLeft;
      if (align === 'center') {
        x = config.pageWidth / 2;
      } else if (align === 'right') {
        x = config.pageWidth - config.marginRight;
      }

      for (let i = 0; i < lines.length; i++) {
        checkPageBreak(lineHeight);
        doc.text(lines[i], x, cursorY, { align: align });
        cursorY += lineHeight;
      }

      cursorY += spaceAfter;
    }

    // Desenhar cabeçalho da primeira página
    drawHeader();

    // Processar cada bloco de conteúdo
    if (Array.isArray(blocks)) {
      blocks.forEach(function(block) {
        if (!block) return;
        if (block.newPage) {
          doc.addPage();
          pageNum++;
          cursorY = config.marginTop;
          drawHeader();
        }

        let color = primaryColor;
        if (block.bold && block.size >= 12) {
          color = primaryColor;
        }

        addText(block.text, {
          bold: block.bold || false,
          size: block.size || 10,
          align: block.align || 'left',
          spaceAfter: block.spaceAfter || 3,
          color: color
        });
      });
    }

    // Adicionar rodapés em todas as páginas geradas
    const totalPages = doc.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      drawFooter(p, totalPages);
    }

    // Salvar o PDF
    doc.save(filename);
  }
};

window.VenturaPDF = VenturaPDF;
