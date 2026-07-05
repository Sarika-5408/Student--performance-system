import { formatResumeData } from "./utils/formatResumeData";
import { useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import ResumeRenderer from "./components/ResumeRenderer";

function ResumeResult() {
  const { state } = useLocation();
  const data = state?.resumeData;

  const [isPrint, setIsPrint] = useState(false);
  const [template, setTemplate] = useState("modern");
  const [imageUrl, setImageUrl] = useState(null);

  const resumeRef = useRef();

 
  // 🔥 FIX IMAGE FOR PDF (BASE64)
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      if (typeof file === "string") return resolve(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  useEffect(() => {
    if (data?.image) {
      toBase64(data.image).then(setImageUrl);
    }
  }, [data]);

   if (!data) return <h2 className="text-white">No Data</h2>;

  // 🔥 FORMAT DATA
  const formattedData = formatResumeData({
   ...data,
   image: imageUrl,
  }); 

  // 🔥 FIXED PDF DOWNLOAD (NO TEMPLATE FORCE + NO IMAGE BREAK)
  const downloadPDF = async () => {
    setIsPrint(true);

    await new Promise((r) => setTimeout(r, 800));

    const element = resumeRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      width: element.offsetWidth,
      windowWidth: element.offsetWidth,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = 595;
    const pageHeight = 842;

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // FIRST PAGE
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // EXTRA PAGES
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${template}-resume.pdf`);

    setIsPrint(false);
  };

  const active = "bg-purple-600 text-white";
  const normal = "bg-gray-700 text-white";

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-10 ${
        isPrint
          ? "bg-gray-200"
          : "bg-black text-white relative overflow-hidden"
      }`}
    >
      {/* 🌈 GLOW THEME */}
      {!isPrint && (
        <>
          <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 blur-[120px] top-[-100px] left-[-100px]" />
          <div className="absolute w-[500px] h-[500px] bg-blue-600 opacity-20 blur-[120px] bottom-[-100px] right-[-100px]" />
        </>
      )}

      {/* 🔥 CONTROLS */}
      <div className="flex gap-4 mb-6 z-10 flex-wrap">
        <button
          onClick={() => setIsPrint(!isPrint)}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          {isPrint ? "App View" : "Print View"}
        </button>

        <button
          onClick={() => setTemplate("modern")}
          className={`px-4 py-2 rounded ${
            template === "modern" ? active : normal
          }`}
        >
          Modern
        </button>

        <button
          onClick={() => setTemplate("classic")}
          className={`px-4 py-2 rounded ${
            template === "classic" ? active : normal
          }`}
        >
          Classic
        </button>

        <button
          onClick={() => setTemplate("minimal")}
          className={`px-4 py-2 rounded ${
            template === "minimal" ? active : normal
          }`}
        >
          Minimal
        </button>

        <button
          onClick={downloadPDF}
          className="ml-auto px-4 py-2 bg-blue-600 rounded"
        >
          Download PDF
        </button>
      </div>

      {/* TEMPLATE NAME */}
      <p className="mb-4 z-10">
        Current Template: <b className="capitalize">{template}</b>
      </p>

      {/* 🔥 RESUME */}
      <div
        ref={resumeRef}
        className={`mx-auto z-10 ${
          isPrint ? "w-[595px]" : "w-[900px]"
        }`}
      >
        <ResumeRenderer
          template={template}
          data={formattedData}
          isPrint={isPrint}
        />
      </div>
    </div>
  );
}

export default ResumeResult;