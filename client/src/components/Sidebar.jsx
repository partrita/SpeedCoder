import { useEffect, useState } from "react";
import Debug from "./Debug";
import LeaderBoard from "./LeaderBoard";
import IconGenerator from "./IconGenerator";
export default function Sidebar(props) {
  const [filestate, setFilestate] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("event") === "bisc" ? "ex.py" : "hello.py";
  });

  const [isEventMode, setIsEventMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const event = params.get("event");
    setIsEventMode(event?.toLowerCase() === "bisc");
  }, []);

  const [filename, setFilename] = useState([
    "hello.py",
    "ex.py",
    "print.c",
    "sha256.java",
    "test.java",
    "server.js",
    "RectangleArea.java",
    "say_hello.py",
    "Example.java",
    "Fibonacci.java",
    "new_template.js",
  ]);
  const [customTemplates, setCustomTemplates] = useState([]);

  useEffect(() => {
    const storedTemplates =
      JSON.parse(localStorage.getItem("customTemplates")) || [];
    setCustomTemplates(storedTemplates);
  }, []);

  useEffect(() => {
    if (props.section === "1" && isEventMode) {
      setFilestate(filestate);
      props.setFile(filestate);
    }
  }, [props.section]);

  useEffect(() => {
    if (props.section === "1" && !isEventMode) {
      setFilestate(filestate);
      props.setFile(filestate);
    } else if (props.section === "2") {
      props.setFile("Statistics");
    }
  }, [props.section]);
  if (props.section === "1") {
    return (
      <div className="sidebar">
        <ul>
          <li className="sidebarsection-header">EXPLORER</li>
        </ul>
        <ul className="sidebarsection-explorer">
          {filename.map((s, i) => {
            return (
              <li
                key={i}
                className={
                  "sidebarsection-list" + (filestate === s ? "active" : "")
                }
                onClick={() => {
                  props.setFile(s);
                  setFilestate(s);
                }}
              >
                <IconGenerator file={s} height={"13px"} />
                {s}
              </li>
            );
          })}
          {customTemplates.length > 0 && (
            <li className="sidebarsection-header">CUSTOM</li>
          )}
          {customTemplates.map((template, i) => {
            return (
              <li
                key={i + filename.length}
                className={
                  "sidebarsection-list" +
                  (filestate === template.filename ? "active" : "")
                }
                onClick={() => {
                  props.setFile(template.filename);
                  setFilestate(template.filename);
                }}
              >
                <IconGenerator file={template.filename} height={"13px"} />
                {template.filename}
              </li>
            );
          })}
        </ul>
        <ul>
          <li className="sidebarsection-header">DEBUG</li>
          <li>
            <Debug
              filestate={filestate}
              fileLength={props.fileLength}
              setFinishTrigger={props.setFinishTrigger}
            />
          </li>
        </ul>
      </div>
    );
  } else if (props.section === "2") {
    return (
      <div className="sidebar">
        <ul>
          <li className="sidebarsection-header">RANKING</li>
        </ul>
        <LeaderBoard daynight={props.daynight} />
      </div>
    );
  } else if (props.section === "3") {
    const [newFilename, setNewFilename] = useState("");
    const [newContent, setNewContent] = useState("");

    const handleSaveTemplate = () => {
      if (newFilename.trim() === "" || newContent.trim() === "") {
        alert("Please enter a filename and content.");
        return;
      }

      const newTemplate = {
        filename: newFilename,
        content: newContent.split(""),
      };

      const existingTemplates =
        JSON.parse(localStorage.getItem("customTemplates")) || [];
      localStorage.setItem(
        "customTemplates",
        JSON.stringify([...existingTemplates, newTemplate])
      );

      setNewFilename("");
      setNewContent("");
      alert("Template saved!");
      window.location.reload();
    };

    return (
      <div className="sidebar">
        <ul>
          <li className="sidebarsection-header">SETTINGS</li>
          <li
            className="sidebarsection-list"
            style={{ display: "block", height: "auto", padding: "10px" }}
          >
            <label htmlFor="fontSize">Font Size: {props.fontSize}px</label>
            <input
              type="range"
              id="fontSize"
              name="fontSize"
              min="10"
              max="40"
              value={props.fontSize}
              onChange={(e) => {
                props.setFontSize(e.target.value);
                localStorage.setItem("fontSize", e.target.value);
              }}
            />
          </li>
          <li
            className="sidebarsection-list"
            style={{ display: "block", height: "auto", padding: "10px" }}
          >
            <h3 style={{ margin: "10px 0" }}>Add New Template</h3>
            <input
              type="text"
              placeholder="Filename (e.g., my_template.js)"
              value={newFilename}
              onChange={(e) => setNewFilename(e.target.value)}
              style={{
                width: "100%",
                padding: "5px",
                marginBottom: "10px",
                backgroundColor: "var(--input-area-color)",
                border: "1px solid var(--input-area-border-color)",
                color: "var(--popup-inner-contents-font-color)",
              }}
            />
            <textarea
              placeholder="Enter template content here"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows="5"
              style={{
                width: "100%",
                padding: "5px",
                marginBottom: "10px",
                backgroundColor: "var(--input-area-color)",
                border: "1px solid var(--input-area-border-color)",
                color: "var(--popup-inner-contents-font-color)",
              }}
            />
            <button
              onClick={handleSaveTemplate}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: "#3f85f7",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save Template
            </button>
          </li>
        </ul>
      </div>
    );
  }
}
