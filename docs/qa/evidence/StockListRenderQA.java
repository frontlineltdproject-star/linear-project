import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import java.nio.file.*;
import java.io.*;
import javax.imageio.ImageIO;
public class StockListRenderQA {
 public static void main(String[] args) throws Exception {
  Path html=Path.of(args[0]), output=Path.of(args[1]);
  System.setProperty("pdfbox.fontcache",output.getParent().toString());
  try(OutputStream out=Files.newOutputStream(output)) {
   PdfRendererBuilder builder=new PdfRendererBuilder();
   builder.useFastMode(); builder.useFont(new File(args[2]),"DeliveryNoteSans");
   builder.withHtmlContent(Files.readString(html),args[3]); builder.toStream(out); builder.run();
  }
  try(PDDocument pdf=PDDocument.load(output.toFile())) {
   PDFTextStripper strip=new PDFTextStripper();
   Files.writeString(Path.of(output.toString()+".txt"),strip.getText(pdf));
   PDFRenderer renderer=new PDFRenderer(pdf);
   for(int p=0;p<pdf.getNumberOfPages();p++)
    ImageIO.write(renderer.renderImageWithDPI(p,120),"PNG",new File(output.toString()+"-"+(p+1)+".png"));
   System.out.println(output.getFileName()+" pages="+pdf.getNumberOfPages()+" dimensions="+pdf.getPage(0).getMediaBox());
  }
 }
}
