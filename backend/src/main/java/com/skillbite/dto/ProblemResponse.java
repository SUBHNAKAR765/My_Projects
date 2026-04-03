package com.skillbite.dto;

import java.util.List;

public class ProblemResponse {
    private Long id;
    private String title;
    private String difficulty;
    private List<String> tags;
    private List<String> companies;
    private String description;
    private String constraints;
    private String sampleInput;
    private String sampleOutput;
    private String editorial;
    private List<String> hints;
    private List<SolutionItem> solutions;
    private List<InputField> inputFields;
    private int timeLimitSeconds;
    private int memoryLimitMb;
    private List<PublicTestCase> testCases;

    public record PublicTestCase(Long id, String input, String expectedOutput) {}
    public record InputField(String name, String type, String placeholder) {}
    public record SolutionItem(String language, String title, String code, String explanation) {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public List<String> getCompanies() { return companies; }
    public void setCompanies(List<String> companies) { this.companies = companies; }
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
    public List<String> getHints() { return hints; }
    public void setHints(List<String> hints) { this.hints = hints; }
    public List<SolutionItem> getSolutions() { return solutions; }
    public void setSolutions(List<SolutionItem> solutions) { this.solutions = solutions; }
    public List<InputField> getInputFields() { return inputFields; }
    public void setInputFields(List<InputField> inputFields) { this.inputFields = inputFields; }
    public int getTimeLimitSeconds() { return timeLimitSeconds; }
    public void setTimeLimitSeconds(int t) { this.timeLimitSeconds = t; }
    public int getMemoryLimitMb() { return memoryLimitMb; }
    public void setMemoryLimitMb(int m) { this.memoryLimitMb = m; }
    public List<PublicTestCase> getTestCases() { return testCases; }
    public void setTestCases(List<PublicTestCase> testCases) { this.testCases = testCases; }
}
