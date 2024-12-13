/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import MonacoEditor from '@monaco-editor/react';
import InputComponent from './InputComponent/InputComponent';
import OutputComponent from './OutputComponent/OutputComponent';
import classes from './CodeEditor.module.css';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { message } from 'antd';


const languageTemplates = {
  cpp: `#include <iostream>
#include <string>

int main() {
    std::string name;
    std::getline(std::cin, name);
    std::cout << "Hello, " << name << "!" << std::endl;
    return 0;
}`,
  javascript: `const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('', name => {
  console.log(\`Hello, \${name}!\`);
  readline.close();
});`,
  python: `name = input()
print(f"Hello, {name}!")`,
  java: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String name = scanner.nextLine();
        System.out.println("Hello, " + name + "!");
        scanner.close();
    }
}`
};

const CodeEditor = ({ type,sampleInput }) => {
  const {id} =useParams();
  const [language, setLanguage] = useState('cpp');
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState(languageTemplates.cpp);
  const [input, setInput] = useState(sampleInput);
  const [output, setOutput] = useState('Output Comes here');

  useEffect(() => {
    setCode(languageTemplates[language]);
  }, [language]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleRunAndSubmitCode = async () => {
    const payload = {
      code,
      language,
      input,
      problemId:id
    };
    console.log(payload);
    try {
      const res = await axios.post('http://localhost:5001/api/run', payload);
      if(id){
        if(res.data.status==="AC"){
          message.success("Congratulations! Your solution is correct");
        }
        else if(res.data.status==="WA"){
          message.error("Sorry, your solution is incorrect");
        }
        else{
          message.error("Compilation Error!!");
        }
      }
      setOutput(res.data.output);
    }
    catch (error) {
      console.error('Error running code:', error);
    }
  };

  return (
    <div className={classes.codeEditorCont} style={type === 'ide' ? { width: '98vw',marginTop:"4rem" } : {width:"97%"}}>
      <div className={classes.editControls}>
        <select value={language} onChange={handleLanguageChange} className={classes.selectInput}>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
        <select value={theme} onChange={handleThemeChange} className={classes.selectInput}>
          <option value="vs-light">Light</option>
          <option value="vs-dark">Dark</option>
        </select>
      </div>
      <MonacoEditor
        height="50vh"
        language={language}
        theme={theme}
        value={code}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 16,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 1 + "rem" },
        }}
        onChange={handleEditorChange}
        className={classes.monacoEditor}
      />
      <div className={classes.ioContainer}>
        <InputComponent input={input} setInput={setInput} />
        <OutputComponent output={output} />
      </div>
      <div className={classes.buttonContainer}>
        <button onClick={handleRunAndSubmitCode} className={classes.runButton}>Run</button>
        <button onClick={handleRunAndSubmitCode} className={classes.submitButton}>Submit</button>
      </div>
    </div>
  );
}

export default CodeEditor;
