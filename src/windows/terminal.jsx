import WindowWrapper from "#hoc/WindowWrapper";
import { Check, Flag } from "lucide-react";
import { techStack } from "../constants";
import WindowControlls from "../components/WindowControlls";

const Terminal = () => {
  return (
    <>
      <div id="window-header">
       <WindowControlls target="terminal" />
        <h2>Tech Stack</h2>
      </div>

      <div className="techstack">
        <p>
          <span className="font-bold">@joao %</span>
          show tech stack
        </p>

        <div className="label">
          <p className="w-32">Category:</p>
          <p>Technologies</p>
        </div>

        <ul className="content">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-center">
              <Check className="check" size={20} />
              <h3>{category}</h3>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>
                    {item}
                    {i < items.length - 1 ? "," : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="footnote">
            <p>
                <Check size ={20} /> 7 of 7 stacks loaded successfully
                (100% complete)
            </p>

            <p className="text-gray-700 dark:text-gray-300">
                <Flag size={15} className="fill-gray-700 dark:fill-gray-300" />
                Render time: 5ms
            </p>
        </div>

      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
