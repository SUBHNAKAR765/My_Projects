package com.skillbite.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Problem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String difficulty; // Easy / Medium / Hard

    @Column(columnDefinition = "TEXT")
    private String tagsCsv; // comma-separated tags (Arrays, Sorting, ...)

    @Column(columnDefinition = "TEXT")
    private String companiesCsv; // comma-separated company tags

    @Column(columnDefinition = "TEXT") private String description;
    @Column(columnDefinition = "TEXT") private String constraints;
    @Column(columnDefinition = "TEXT") private String sampleInput;
    @Column(columnDefinition = "TEXT") private String sampleOutput;

    @Column(columnDefinition = "TEXT")
    private String editorial; // markdown/plain text

    @Column(columnDefinition = "TEXT")
    private String hintsJson; // JSON array of strings

    @Column(columnDefinition = "TEXT")
    private String solutionsJson; // JSON array of {language, title, code, explanation}

    @Column(columnDefinition = "TEXT")
    private String inputFieldsJson; // JSON array of {name, type, placeholder}

    private int timeLimitSeconds = 2;
    private int memoryLimitMb = 256;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TestCase> testCases;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getTagsCsv() { return tagsCsv; }
    public void setTagsCsv(String tagsCsv) { this.tagsCsv = tagsCsv; }
    public String getCompaniesCsv() { return companiesCsv; }
    public void setCompaniesCsv(String companiesCsv) { this.companiesCsv = companiesCsv; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getConstraints() { return constraints; }
    public void setConstraints(String constraints) { this.constraints = constraints; }
    public String getSampleInput() { return sampleInput; }
    public void setSampleInput(String sampleInput) { this.sampleInput = sampleInput; }
    public String getSampleOutput() { return sampleOutput; }
    public void setSampleOutput(String sampleOutput) { this.sampleOutput = sampleOutput; }
    public String getEditorial() { return editorial; }
    public void setEditorial(String editorial) { this.editorial = editorial; }
    public String getHintsJson() { return hintsJson; }
    public void setHintsJson(String hintsJson) { this.hintsJson = hintsJson; }
    public String getSolutionsJson() { return solutionsJson; }
    public void setSolutionsJson(String solutionsJson) { this.solutionsJson = solutionsJson; }
    public String getInputFieldsJson() { return inputFieldsJson; }
    public void setInputFieldsJson(String inputFieldsJson) { this.inputFieldsJson = inputFieldsJson; }
    public int getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(int t) { this.timeLimitSeconds = t; }
    public int getMemoryLimitMb() { return memoryLimitMb; }
    public void setMemoryLimitMb(int m) { this.memoryLimitMb = m; }
    public List<TestCase> getTestCases() { return testCases; }
    public void setTestCases(List<TestCase> testCases) { this.testCases = testCases; }
}
