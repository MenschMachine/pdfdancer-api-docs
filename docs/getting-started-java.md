---
id: getting-started-java
title: Getting Started with Java
description: Complete beginner guide to editing PDFs with PDFDancer and Java.
---

# Getting Started with Java

This guide walks you through editing your first PDF with PDFDancer, from scratch.

## What You'll Build

By the end of this guide, you'll have a working Java application that:
- Opens a PDF file
- Finds and replaces text
- Saves the modified PDF

## Prerequisites

You need **Java 11 or higher** installed on your computer.

Check your Java version:

```bash
java -version
```

If you see `11` or higher, you're good to go.

**Don't have Java?** Download it from [Adoptium](https://adoptium.net/) or [Oracle](https://www.oracle.com/java/technologies/downloads/).

## Step 1: Create a Project Folder

Open your terminal and create a new folder for your project:

```bash
mkdir my-pdf-project
cd my-pdf-project
```

## Step 2: Set Up the Project

Create a `pom.xml` file with the PDFDancer dependency:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>my-pdf-project</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
    </properties>

    <dependencies>
        <dependency>
            <groupId>com.pdfdancer.client</groupId>
            <artifactId>pdfdancer-client-java</artifactId>
            <version>0.2.3</version>
        </dependency>
    </dependencies>
</project>
```

## Step 3: Get a Sample PDF

You need a PDF file to work with. Either:
- Use any PDF you already have
- Create a simple one with Google Docs or Word

Place your PDF in the project folder and name it `input.pdf`.

## Step 4: Write Your First Program

Create the directory structure and Java file:

```bash
mkdir -p src/main/java
```

Create `src/main/java/EditPdf.java` with this code:

```java
import com.pdfdancer.client.rest.PDFDancer;
import com.pdfdancer.client.rest.TextParagraphReference;

import java.io.File;
import java.util.List;

public class EditPdf {
    public static void main(String[] args) throws Exception {
        // Open the PDF (no API token needed for anonymous access)
        PDFDancer pdf = PDFDancer.createSession(new File("input.pdf"));

        // Find paragraphs containing specific text
        List<TextParagraphReference> paragraphs = pdf.page(1)
                .selectParagraphsContaining("Hello");

        // Replace the text if found
        if (!paragraphs.isEmpty()) {
            paragraphs.get(0).edit()
                    .replace("Hello World!")
                    .apply();
        }

        // Save the result
        pdf.save("output.pdf");

        System.out.println("Done! Check output.pdf");
    }
}
```

**What this does:**
1. Opens `input.pdf`
2. Looks for any paragraph containing "Hello" on page 1
3. Replaces that paragraph's text with "Hello World!"
4. Saves the result as `output.pdf`

## Step 5: Run It

Compile and run with Maven:

```bash
mvn compile exec:java -Dexec.mainClass="EditPdf"
```

You should see `Done! Check output.pdf` and find a new file called `output.pdf` in your folder.

## What's Next?

Now that you have PDFDancer working:

- [**Concepts**](concepts.md) – Understand how PDFDancer approaches PDF editing
- [**Finding Content**](finding-content.md) – Learn all the ways to select text and elements
- [**Working with Text**](working-with-text.md) – Add, edit, move, and style paragraphs
- [**Cookbook**](cookbook.md) – Common patterns and recipes
