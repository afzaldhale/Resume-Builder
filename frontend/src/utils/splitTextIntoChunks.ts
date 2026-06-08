export const splitTextIntoChunks = (
  text: string,
  makePage: () => HTMLElement,
  currentPage: HTMLElement,
  A4_HEIGHT_PX: number,
  headerClone?: Node
) => {
  // Split into paragraphs first
  const paragraphs = String(text || "").split(/\n\s*\n|\r\n\s*\r\n|\n/).filter(Boolean);

  const appendParaToPage = (paraText: string, page: HTMLElement) => {
    const p = document.createElement("p");
    p.className = "resume-body-copy";
    p.textContent = paraText;
    page.appendChild(p);
    return p;
  };

  const splitBySentences = (para: string) => {
    // naive sentence splitter, keeps punctuation
    const sentences = para.match(/[^.!?\n]+[.!?\n]*/g) || [para];
    return sentences.map((s) => s.trim()).filter(Boolean);
  };

  for (const para of paragraphs) {
    const hadBefore = currentPage.childNodes.length > 0;
    const pNode = appendParaToPage(para, currentPage);
    if (currentPage.scrollHeight <= A4_HEIGHT_PX + 2) {
      continue;
    }

    // overflow
    currentPage.removeChild(pNode);
    if (hadBefore) {
      // start a new page and append paragraph
      currentPage = makePage();
      if (headerClone) currentPage.appendChild(headerClone.cloneNode(true));
      appendParaToPage(para, currentPage);
      // if still overflows, fall through to splitting
      if (currentPage.scrollHeight <= A4_HEIGHT_PX + 2) continue;
    }

    // Need to split the paragraph into smaller chunks (sentences then words)
    const sentences = splitBySentences(para);
    let buffer = "";
    for (let i = 0; i < sentences.length; i++) {
      const s = sentences[i];
      const trial = buffer ? `${buffer} ${s}` : s;
      const trialNode = appendParaToPage(trial, currentPage);
      if (currentPage.scrollHeight <= A4_HEIGHT_PX + 2) {
        buffer = trial;
        // keep trialNode in place and continue
        continue;
      }
      // trial overflows
      currentPage.removeChild(trialNode);
      if (buffer) {
        // flush buffer to page
        appendParaToPage(buffer, currentPage);
      }
      // start new page
      currentPage = makePage();
      if (headerClone) currentPage.appendChild(headerClone.cloneNode(true));

      // try to fit sentence s into new page; if too big, split by words
      const sNode = appendParaToPage(s, currentPage);
      if (currentPage.scrollHeight <= A4_HEIGHT_PX + 2) {
        buffer = s;
        continue;
      }
      // Sentence too big for empty page; split by words
      currentPage.removeChild(sNode);
      const words = s.split(/\s+/).filter(Boolean);
      let wBuffer = [] as string[];
      for (let wi = 0; wi < words.length; wi++) {
        wBuffer.push(words[wi]);
        const trialW = wBuffer.join(" ");
        const tn = appendParaToPage(trialW, currentPage);
        if (currentPage.scrollHeight <= A4_HEIGHT_PX + 2) {
          // fits so far
          continue;
        }
        // doesn't fit
        currentPage.removeChild(tn);
        // if there was more than one word, back off one word
        if (wBuffer.length > 1) {
          const last = wBuffer.pop();
          appendParaToPage(wBuffer.join(" "), currentPage);
          // start new page and continue with the last word as first
          currentPage = makePage();
          if (headerClone) currentPage.appendChild(headerClone.cloneNode(true));
          wBuffer = last ? [last] : [];
        } else {
          // single word too big, append anyway to avoid infinite loop
          appendParaToPage(wBuffer.join(" "), currentPage);
          currentPage = makePage();
          if (headerClone) currentPage.appendChild(headerClone.cloneNode(true));
          wBuffer = [];
        }
      }
      buffer = "";
    }
  }

  return currentPage;
};

export default splitTextIntoChunks;
