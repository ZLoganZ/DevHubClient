import { Moon, Sun } from "lucide-react";
import { Button, Dropdown } from "antd";

import { useTheme } from "@/components/ThemeProvider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  const { theme } = useTheme();

  return (
    <Dropdown
      menu={{
        items: [
          {
            key: "1",
            label: (
              <Button
                className="w-full h-full "
                onClick={() => setTheme("light")}>
                Light
              </Button>
            ),
          },
          {
            key: "2",
            label: (
              <Button
                className="w-full h-full "
                onClick={() => setTheme("dark")}>
                Dark
              </Button>
            ),
          },
          {
            key: "3",
            label: (
              <Button
                className="w-full h-full "
                onClick={() => setTheme("system")}>
                System
              </Button>
            ),
          },
        ],
        selectable: true,
        selectedKeys:
          theme === "system" ? ["3"] : theme === "light" ? ["1"] : ["2"],
      }}
      placement="bottomCenter"
      trigger={["click"]}>
      <Button>
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {/* <span className="sr-only">Toggle theme</span> */}
      </Button>
    </Dropdown>
  );
}
