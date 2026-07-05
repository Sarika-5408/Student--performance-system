import TemplateModern from "../templates/TemplateModern";
import TemplateClassic from "../templates/TemplateClassic";
import TemplateMinimal from "../templates/TemplateMinimal";

const ResumeRenderer = ({ template, data, isPrint }) => {
  switch (template) {
    case "classic":
      return <TemplateClassic data={data} isPrint={isPrint} />;
    case "minimal":
      return <TemplateMinimal data={data} isPrint={isPrint} />;
    default:
      return <TemplateModern data={data} isPrint={isPrint} />;
  }
};

export default ResumeRenderer;