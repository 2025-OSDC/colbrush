import { ThemeStorageKey } from '../core/constants/key.js';
import { THEME_MODES } from '../core/constants/modes.js';

const script = `try{var t=localStorage.getItem(${JSON.stringify(
    ThemeStorageKey,
)});if(${JSON.stringify(
    THEME_MODES,
)}.indexOf(t)>-1)document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export function ThemeScript() {
    return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
