---
id: getting-started-java
title: Getting Started with Java
description: Install the Java SDK and complete a verified PDF text-editing workflow, including opening a document, changing text, and saving the result.
---

# Getting Started with Java

This tutorial downloads a known PDF, replaces `Hello` with `Final` on page 1, and writes the edited file to `output.pdf`. No account or API token is required. Anonymous output is watermarked.

## 1. Create a Maven project

Create `src/main/java/EditPdf.java` and a `pom.xml` in an empty directory. Java 17 or newer is required.

```xml title="pom.xml"
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>example</groupId>
  <artifactId>pdfdancer-java-demo</artifactId>
  <!-- This is the example application's version, not the PDFDancer SDK version. -->
  <version>1.0.0</version>
  <properties>
    <maven.compiler.release>17</maven.compiler.release>
  </properties>
  <dependencies>
    <dependency>
      <groupId>com.pdfdancer.client</groupId>
      <artifactId>pdfdancer-client-java</artifactId>
      <version>3.0.0</version>
    </dependency>
  </dependencies>
  <build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.13.0</version>
      </plugin>
    </plugins>
  </build>
</project>
```

## 2. Download the input PDF

```bash
curl -L https://docs.pdfdancer.com/files/v3/pdfdancer-v3-quickstart.pdf -o input.pdf
```

## 3. Create `EditPdf.java`

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.common.request.TextReplaceRequest;
import com.pdfdancer.common.response.TextEditResponse;

public class EditPdf {
    public static void main(String[] args) throws Exception {
        PDFDancer pdf = PDFDancer.createSession("input.pdf");
        TextEditResponse response = pdf.page(1).text().replace(
                TextReplaceRequest.literal("Hello", "Final").build());

        if (response.matched() == 0) {
            throw new IllegalStateException("The source text was not found");
        }
        if (response.errors() != null && !response.errors().isEmpty()) {
            throw new IllegalStateException("The edit failed: " + response.errors());
        }
        pdf.save("output.pdf");
    }
}
```

`pdf.page(1).text()` restricts the edit to page 1. Use `pdf.text()` to search the whole document.

## 4. Run it

```bash
mvn compile org.codehaus.mojo:exec-maven-plugin:3.5.0:java -Dexec.mainClass=EditPdf
```

The program exits without output when the edit succeeds. Open `output.pdf` and confirm that `Hello` became `Final`. If the program reports that the text was not found, see [When visible text does not match](./working-with-text#when-visible-text-does-not-match).

Gradle users can add `implementation("com.pdfdancer.client:pdfdancer-client-java:3.0.0")`.

Next, learn about [text targeting and responses](./working-with-text) or [other content types](./concepts).
