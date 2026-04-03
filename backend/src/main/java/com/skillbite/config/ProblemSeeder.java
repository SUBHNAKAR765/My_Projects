package com.skillbite.config;

import com.skillbite.model.Problem;
import com.skillbite.model.TestCase;
import com.skillbite.repository.ProblemRepository;
import com.skillbite.repository.TestCaseRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Order(2)
public class ProblemSeeder implements CommandLineRunner {

    private final ProblemRepository problemRepo;
    private final TestCaseRepository testCaseRepo;
    private final ObjectMapper mapper = new ObjectMapper();

    public ProblemSeeder(ProblemRepository problemRepo, TestCaseRepository testCaseRepo) {
        this.problemRepo = problemRepo;
        this.testCaseRepo = testCaseRepo;
    }

    @Override
    public void run(String... args) {
        if (problemRepo.count() > 0) return;

        seedProblem(
            "Two Sum",
            "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nReturn the answer in any order.",
            "Easy",
            "Arrays,Hashing",
            "Amazon,Google,Microsoft",
            "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9",
            "4\n2 7 11 15\n9",
            "0 1",
            """
            ## Approach
            Use a hash map to store value → index while scanning the array.

            - For each `nums[i]`, compute `need = target - nums[i]`.
            - If `need` exists in the map, you found the pair.
            - Otherwise store `nums[i]` with its index.

            **Time:** O(n)  
            **Space:** O(n)
            """,
            List.of(
                "Hint 1: If you know a number, you can compute the number you need.",
                "Hint 2: Use a map from number to its index to find the needed value quickly.",
                "Hint 3: Insert after checking to avoid using the same element twice."
            ),
            List.of(
                new SolutionItem("java", "HashMap (O(n))", 
                    "import java.util.*;\n\npublic class Solution {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int n = Integer.parseInt(sc.nextLine().trim());\n    int[] nums = new int[n];\n    String[] parts = sc.nextLine().trim().split(\"\\\\s+\");\n    for (int i = 0; i < n; i++) nums[i] = Integer.parseInt(parts[i]);\n    int target = Integer.parseInt(sc.nextLine().trim());\n\n    Map<Integer,Integer> map = new HashMap<>();\n    for (int i = 0; i < n; i++) {\n      int need = target - nums[i];\n      if (map.containsKey(need)) {\n        System.out.println(map.get(need) + \" \" + i);\n        return;\n      }\n      map.put(nums[i], i);\n    }\n  }\n}\n",
                    "Store seen numbers in a HashMap; check complement each step."
                ),
                new SolutionItem("python", "Dictionary (O(n))",
                    "import sys\n\ndef main():\n    data = sys.stdin.read().strip().split()\n    if not data:\n        return\n    n = int(data[0])\n    nums = list(map(int, data[1:1+n]))\n    target = int(data[1+n])\n    seen = {}\n    for i, x in enumerate(nums):\n        need = target - x\n        if need in seen:\n            print(seen[need], i)\n            return\n        seen[x] = i\n\nif __name__ == \"__main__\":\n    main()\n",
                    "Use a dict to store value->index and print when complement exists."
                ),
                new SolutionItem("cpp", "Unordered map (O(n))",
                    "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(){\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n  int n; if(!(cin>>n)) return 0;\n  vector<long long> a(n);\n  for(int i=0;i<n;i++) cin>>a[i];\n  long long target; cin>>target;\n  unordered_map<long long,int> mp;\n  mp.reserve(n*2);\n  for(int i=0;i<n;i++){\n    long long need = target - a[i];\n    auto it = mp.find(need);\n    if(it!=mp.end()){\n      cout<<it->second<<\" \"<<i;\n      return 0;\n    }\n    mp[a[i]] = i;\n  }\n  return 0;\n}\n",
                    "Track seen values in an unordered_map and check complement."
                )
            ),
            List.of(
                new InputField("n", "int", "Array length"),
                new InputField("nums", "int[]", "Space-separated numbers"),
                new InputField("target", "int", "Target sum")
            ),
            List.of(
                tc("4\n2 7 11 15\n9", "0 1", false),
                tc("3\n3 2 4\n6", "1 2", false),
                tc("2\n3 3\n6", "0 1", true),
                tc("5\n1 5 3 7 2\n9", "1 3", true)
            )
        );

        seedProblem(
            "Reverse String",
            "Write a function that reverses a string. The input string is given as an array of characters `s`.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.\n\nPrint the reversed string on a single line.",
            "Easy",
            "Strings,Two Pointers",
            "Amazon,Microsoft",
            "1 <= s.length <= 10^5\ns[i] is a printable ASCII character.",
            "hello",
            "olleh",
            """
            ## Approach
            Two-pointer swap:

            - `l = 0`, `r = n-1`
            - swap `s[l]` and `s[r]`, move inward until `l >= r`

            **Time:** O(n)  
            **Space:** O(1) extra
            """,
            List.of(
                "Hint 1: Swapping the first and last character is progress.",
                "Hint 2: Use two pointers that move toward the center."
            ),
            List.of(
                new SolutionItem("java", "Two pointers",
                    "import java.util.*;\n\npublic class Solution {\n  public static void main(String[] args){\n    Scanner sc = new Scanner(System.in);\n    String s = sc.hasNextLine()? sc.nextLine() : \"\";\n    char[] a = s.toCharArray();\n    int l=0, r=a.length-1;\n    while(l<r){\n      char t=a[l]; a[l]=a[r]; a[r]=t;\n      l++; r--;\n    }\n    System.out.println(new String(a));\n  }\n}\n",
                    "Swap from both ends until pointers meet."
                ),
                new SolutionItem("python", "Reverse slicing (simple)",
                    "import sys\n\ndef main():\n    s = sys.stdin.read().splitlines()\n    s = s[0] if s else \"\"\n    print(s[::-1])\n\nif __name__ == \"__main__\":\n    main()\n",
                    "Python slicing reverses the string."
                ),
                new SolutionItem("cpp", "Two pointers",
                    "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(){\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n  string s; getline(cin,s);\n  int l=0,r=(int)s.size()-1;\n  while(l<r) swap(s[l++], s[r--]);\n  cout<<s;\n  return 0;\n}\n",
                    "Swap characters in-place."
                )
            ),
            List.of(
                new InputField("s", "string", "Input string")
            ),
            List.of(
                tc("hello", "olleh", false),
                tc("Hannah", "hannaH", false),
                tc("abcdefg", "gfedcba", true),
                tc("a", "a", true)
            )
        );

        seedProblem(
            "FizzBuzz",
            "Given an integer `n`, for each integer `i` from 1 to n:\n- Print `FizzBuzz` if i is divisible by both 3 and 5.\n- Print `Fizz` if i is divisible by 3.\n- Print `Buzz` if i is divisible by 5.\n- Otherwise print `i`.\n\nPrint each value on a new line.",
            "Easy",
            "Math,Simulation",
            "Google,Amazon",
            "1 <= n <= 10^4",
            "15",
            "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
            """
            ## Approach
            Iterate from 1..n and build the output:

            - divisible by 15 → FizzBuzz
            - divisible by 3 → Fizz
            - divisible by 5 → Buzz
            - else → i
            """,
            List.of(
                "Hint 1: Check divisibility by both 3 and 5 first.",
                "Hint 2: 3 and 5 together means divisible by 15."
            ),
            List.of(
                new SolutionItem("java", "Loop + conditions",
                    "import java.util.*;\n\npublic class Solution {\n  public static void main(String[] args){\n    Scanner sc = new Scanner(System.in);\n    int n = sc.hasNextInt()? sc.nextInt() : 0;\n    StringBuilder sb = new StringBuilder();\n    for(int i=1;i<=n;i++){\n      if(i%15==0) sb.append(\"FizzBuzz\");\n      else if(i%3==0) sb.append(\"Fizz\");\n      else if(i%5==0) sb.append(\"Buzz\");\n      else sb.append(i);\n      if(i<n) sb.append('\\n');\n    }\n    System.out.print(sb.toString());\n  }\n}\n",
                    "Check 15, then 3, then 5."
                ),
                new SolutionItem("python", "Loop + conditions",
                    "import sys\n\ndef main():\n    data = sys.stdin.read().strip().split()\n    n = int(data[0]) if data else 0\n    out=[]\n    for i in range(1,n+1):\n        if i%15==0: out.append('FizzBuzz')\n        elif i%3==0: out.append('Fizz')\n        elif i%5==0: out.append('Buzz')\n        else: out.append(str(i))\n    sys.stdout.write('\\n'.join(out))\n\nif __name__=='__main__':\n    main()\n",
                    "Direct simulation."
                ),
                new SolutionItem("cpp", "Loop + conditions",
                    "#include <bits/stdc++.h>\nusing namespace std;\n\nint main(){\n  ios::sync_with_stdio(false);\n  cin.tie(nullptr);\n  int n; if(!(cin>>n)) return 0;\n  for(int i=1;i<=n;i++){\n    if(i%15==0) cout<<\"FizzBuzz\";\n    else if(i%3==0) cout<<\"Fizz\";\n    else if(i%5==0) cout<<\"Buzz\";\n    else cout<<i;\n    if(i<n) cout<<\"\\n\";\n  }\n  return 0;\n}\n",
                    "Print per number."
                )
            ),
            List.of(
                new InputField("n", "int", "Upper limit")
            ),
            List.of(
                tc("15", "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", false),
                tc("3", "1\n2\nFizz", false),
                tc("5", "1\n2\nFizz\n4\nBuzz", true),
                tc("1", "1", true)
            )
        );

        System.out.println("Seeded 3 sample coding problems.");
    }

    private void seedProblem(
            String title,
            String description,
            String difficulty,
            String tagsCsv,
            String companiesCsv,
            String constraints,
            String sampleInput,
            String sampleOutput,
            String editorial,
            List<String> hints,
            List<SolutionItem> solutions,
            List<InputField> inputFields,
            List<TestCase> testCases
    ) {
        Problem p = new Problem();
        p.setTitle(title);
        p.setDescription(description);
        p.setDifficulty(difficulty);
        p.setTagsCsv(tagsCsv);
        p.setCompaniesCsv(companiesCsv);
        p.setConstraints(constraints);
        p.setSampleInput(sampleInput);
        p.setSampleOutput(sampleOutput);
        p.setEditorial(editorial);
        p.setHintsJson(writeJson(hints));
        p.setSolutionsJson(writeJson(solutions));
        p.setInputFieldsJson(writeJson(inputFields));
        p.setTimeLimitSeconds(2);
        p.setMemoryLimitMb(256);
        Problem saved = problemRepo.save(p);
        testCases.forEach(tc -> {
            tc.setProblem(saved);
            testCaseRepo.save(tc);
        });
    }

    private String writeJson(Object o) {
        try { return mapper.writeValueAsString(o); } catch (Exception e) { return "[]"; }
    }

    private TestCase tc(String input, String expected, boolean hidden) {
        TestCase tc = new TestCase();
        tc.setInput(input);
        tc.setExpectedOutput(expected);
        tc.setHidden(hidden);
        return tc;
    }

    private record InputField(String name, String type, String placeholder) {}
    private record SolutionItem(String language, String title, String code, String explanation) {}
}
