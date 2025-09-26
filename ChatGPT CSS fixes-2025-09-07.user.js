// ==UserScript==
// @name         ChatGPT CSS fixes
// @version      2025-09-07
// @updateURL    https://gist.github.com/alexchexes/d2ff0b9137aa3ac9de8b0448138125ce/raw/chatgpt_ui_fix.user.js
// @downloadURL  https://gist.github.com/alexchexes/d2ff0b9137aa3ac9de8b0448138125ce/raw/chatgpt_ui_fix.user.js
// @namespace    http://tampermonkey.net/
// @description  Adjusts width of side bar and messages of the ChatGPT web interface
// @author       alexchexes
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM_addStyle
// ==/UserScript==

/* global GM_addStyle */

console.info("%c'ChatGPT CSS fixes' userscript is connected", 'color: #8ff; background: #000');

(function () {
	const SELECTORS = {
		PROMPT_INPUT: `div#prompt-textarea.ProseMirror`,
		SIDEBAR: `#stage-slideover-sidebar[style*="sidebar-width"]`,
	};

	// Prevent chatGPT bug that breaks interface when PageUp/PgDown key is pressed when textarea is focused and not empty
	document.addEventListener('keydown', function (e) {
		if (
			(e.key === 'PageUp' || e.key === 'PageDown') &&
			e.target.matches(SELECTORS.PROMPT_INPUT)
		) {
			e.preventDefault();
		}
	});

	const accentForDark = `#f39c12`;

	const defaultSettings = {
		/* CHAT ELEMENTS */

		chatWidth: {
			enabled: true,
			maxWidth: `90%`,
		},

    userInputWidth: {
			enabled: true,
			maxWidth: `70%`,
    },

    projectScreenWidth: {
			enabled: true,
			maxWidth: `70vw`,
    },

		textAreaHeight: {
			enabled: true,
			maxHeight: '50dvh',
		},

		codeBlockFont: {
			enabled: true,
			fontFamily: `Consolas`,
		},

		codeBlockBackground: {
			enabled: true,
			bgColorDark: `#181818`,
			// bgColorLight: `#252525`,
		},

		codeBlockLineBreaks: { enabled: true },
		inlineCodeColor: { enabled: true },
		codeBlocksInUserMessages: { enabled: true },

		userMessageVisibility: {
			enabled: true,
			backgroundDark: `linear-gradient(135deg, #34437a, #2b2f54)`,
			backgroundLight: `#c1d6f6`,
		},

		botAvatarVisibility: { enabled: true },

		botThinkingHeadings: {
			enabled: true,
			colorDark: `#66ceff`,
			colorLight: `#0047c2`,
		},

    responseVariantsVisibility: { enabled: true },

    tableMargins: { enabled: true },

		/* TOP BAR */

		topBarTransparency: { enabled: true },

		projectChatNameVisibility: { enabled: true },

		gptVersionVisibility: {
			enabled: true,
			color: accentForDark,
		},

		/* SIDEBAR */

		sidebarWidth: {
			enabled: true,
			sidebarWidth: `330px`,
		},
		sidebarHeadingsVisibility: {
			enabled: true,
			color: accentForDark,
		},
		multilineHistoryTitles: {
			enabled: true,
		},

		/* MISC (chatGPT) */

		// modal in Personalisation > Memory height
		saneModalHeight: {
			enabled: true,
		},

    projectChatsSubtitles: {
      enabled: true,
    },

    projectChatsListWidth: {
      enabled: true,
    },

    projectChatsPaddings: {
      enabled: true,
    },

    /* CODEX */
    inTaskTextAreaSize: {
      enabled: true,
    },
	};

	const constructFeaturesCss = () => {
		const cssByFeature = {
			/*------------------------------*
			 *         CHAT ELEMENTS         *
			 *-------------------------------*/

			/* Main chat section width */
			chatWidth: `
				@container (min-width: 768px) {
					article .\\[--thread-content-max-width\\:40rem\\] {
						max-width: ${defaultSettings.chatWidth.maxWidth} !important;
					}
				}
			`,

			userInputWidth: `
				@container (min-width: 768px) {
          #thread-bottom-container .\\[--thread-content-max-width\\:40rem\\] {
            max-width: ${defaultSettings.userInputWidth.maxWidth} !important;
          }
				}
			`,

			projectScreenWidth: `
				@container (min-width: 850px) {
          .px-\\(--thread-content-margin\\).h-full > .mx-auto.flex.max-w-\\(--thread-content-max-width\\).flex-1.text-base.flex-col {
            max-width: ${defaultSettings.projectScreenWidth.maxWidth} !important;
          }
				}
			`,

			textAreaHeight: `
				@media (min-width: 768px) {
					.max-h-\\[25dvh\\].overflow-auto {
						max-height: ${defaultSettings.textAreaHeight.maxHeight};
					}
				}
			`,

			/* Code blocks font */
			codeBlockFont: `
				code, pre {
					font-family: ${defaultSettings.codeBlockFont.fontFamily}, ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace !important;
				}
			`,

			/* Code blocks background color */
			codeBlockBackground: `
				/* DARK */
				html.dark pre > div.rounded-md {
					background-color: ${defaultSettings.codeBlockBackground.bgColorDark};
				}
			`,

			/* Break lines in code blocks */
			codeBlockLineBreaks: `
				code[class][class][class], code[class][class][class].whitespace-pre\\!, code.whitespace-pre\\!:not([data-highlighted="true"]) > span:only-child {
	        display: inline-block;
	        white-space: pre-wrap !important;
	        overflow-wrap: anywhere !important;
        }
			`,

      inlineCodeColor: `
        html.dark [data-message-author-role="user"] div > code,
				html.dark .prose code:not(:where(pre code)) {
	        color: #eab38a;
	        background: #272727;
	        border: 1px solid rgba(94, 93, 89, 0.25);
        }
        html.dark .prose a>code:not(:where(pre code)) {
	        color: inherit;
        }
      `,

			/* Code blocks inside user messages */
			codeBlocksInUserMessages: `
				/* inline code */
				[data-message-author-role="user"] div > code {
					font-size: 14px;
					background: #00000030 !important;
					border-radius: .25rem;
					padding: 1px 5px;
					border: 1px solid #00000026 !important;
				}

				/* multiline code blocks */
				[data-message-author-role="user"] pre {
					background: #00000030;
					padding: 2px 7px;
					border-radius: 11px;
				}

				/* multiline code blocks FONT SIZE */
				[data-message-author-role="user"] pre > code {
					font-size: 14px;
				}
			`,

			/* Make our messages more visible. */
			userMessageVisibility: `
				/* DARK */
				html.dark [data-message-author-role="user"].text-message > .w-full > .user-message-bubble-color {
					background: ${defaultSettings.userMessageVisibility.backgroundDark};
				}

				/* LIGHT */
				html.light [data-message-author-role="user"].text-message > .w-full > .user-message-bubble-color {
					background: ${defaultSettings.userMessageVisibility.backgroundLight};
				}
			`,

			/* Make bot message start more visible by increasing visibility of its avatar. */
			botAvatarVisibility: `
				/* DARK */
				html.dark .gizmo-bot-avatar > div {
					background: linear-gradient(45deg, #3F51B5, #00BCD4);
				}
				html.dark .gizmo-bot-avatar {
					outline: none;
				}

				/* LIGHT */
				html.light .gizmo-bot-avatar > div {
					background: #252525;
					color: #ffffff;
				}
			`,

			botThinkingHeadings: `
			  html.dark article p strong.font-semibold.text-token-text-primary {
			  	color: ${defaultSettings.botThinkingHeadings.colorDark};
			  }
		  	html.light article p strong.font-semibold.text-token-text-primary {
		  		color: ${defaultSettings.botThinkingHeadings.colorLight};
		  	}
			`,


			responseVariantsVisibility: `
			  article div.has-data-\\[state\\=open\\]\\:opacity-100:has(button[aria-label="Previous response"]) {
			  	opacity: 1 !important;
			  }
        button[aria-label="Previous response"] + div.tabular-nums {
          background: #f39c12;
	        border-radius: 6px;
	        color: #181818;
	        padding: 0 5px;
        }
			`,

      tableMargins: `
        article [class^="_tableContainer"] {
	        width: 100%;
	        max-width: 100%;
	        margin: 0;
	        scrollbar-width: auto;
          pointer-events: auto;
        }
        article [class^="_tableContainer"] > [class^="_tableWrapper"] {
	        margin: 0;
        }
      `,

			/*----------------*
			 *     TOP BAR     *
			 *-----------------*/

			/* Make top bar transparent as it consumes vertical space for no reason */
			topBarTransparency: `
				#page-header {
					background: transparent !important;
	        position: absolute;
	        width: 100%;
	        box-shadow: none;
				}
        #page-header + div .\\@thread-xl\\/thread\\:pt-header-height {
	        padding-top: 32px;
        }

				/* Background for top bar element that shows the current GPT version */
				/* DARK */
				html.dark #page-header button:not(:hover) {
					background-color: #2121218a;
					border-radius: 8px;
					backdrop-filter: blur(2px);
				}
				/* LIGHT */
				html.light #page-header button:not(:hover) {
					background-color: #ffffffb0;
					border-radius: 8px;
					backdrop-filter: blur(2px);
				}
			`,

			/* Project chat name visibility */
			projectChatNameVisibility: `
				/* DARK */
				html.dark main .sticky.top-0 .flex.items-center.gap-0.overflow-hidden button > div.truncate {
					color: #e9cc9e;
				}
				/* LIGHT */
				html.light main .sticky.top-0 .flex.items-center.gap-0.overflow-hidden button > div.truncate {
					color: #000;
				}
			`,

			/* GPT version visibility */
			gptVersionVisibility: `
				/* DARK */
				html.dark .sticky.top-0 [type="button"] > div > span.text-token-text-tertiary {
					color: ${defaultSettings.gptVersionVisibility.color};
				}
				/* LIGHT */
				html.light .sticky.top-0 [type="button"] > div > span.text-token-text-tertiary {
					color: #000;
				}
			`,

			/*------------------*
			 *      SIDEBAR      *
			 *-------------------*/

			/* Sidebar width */
			sidebarWidth: `
				@media not all and (max-width: 768px) {
					${SELECTORS.SIDEBAR},
					${SELECTORS.SIDEBAR} .w-\\[var\\(--sidebar-width\\)\\] {
						width: ${defaultSettings.sidebarWidth.sidebarWidth} !important;
					}
				}
			`,

			/* History periods headings (like "Today", "Yesterday") visibility */
			sidebarHeadingsVisibility: `
				/* DARK */
				html.dark ${SELECTORS.SIDEBAR} h3 {
					color: ${defaultSettings.sidebarHeadingsVisibility.color};
				}

				/* LIGHT */
				html.light ${SELECTORS.SIDEBAR} h3 {
					font-weight: 700;
				}
			`,

			multilineHistoryTitles: `
				${SELECTORS.SIDEBAR} #history a[draggable="true"] .truncate {
					overflow: visible;
					white-space: normal;
				}
				${SELECTORS.SIDEBAR} #history a[draggable="true"] > div.text-token-text-tertiary.flex.items-center.self-stretch {
          position: absolute;
	        right: 5px;
	        top: 50%;
	        translate: 0 -50%;
				}
			`,

			/* MISC */
			saneModalHeight: `
				div[role="dialog"] .h-\\[24rem\\] {
					height: 75vh;
				}
			`,

      projectChatsSubtitles: `
        html.dark li.hover\\:bg-token-bg-tertiary a .text-token-text-secondary.truncate.text-sm {
	        color: #999999;
        }
      `,

      projectChatsListWidth: `
        .text-base.overflow-y-auto.my-auto.mx-auto:has(li.hover\\:bg-token-bg-tertiary) {
          width: 100%;
        }
      `,

      projectChatsPaddings: `
        li.hover\\:bg-token-bg-tertiary .group.relative.flex.flex-col.gap-1.p-4 {
	        padding-block: 8px;
        }
      `,

      inTaskTextAreaSize: `
        ._prosemirror-parent_kfgfu_2 {
          max-height: 50vh !important;
        }
      `,
		};

		// Adding a unique string to find our <style> element later
		let cssStyles = `/* USERSCRIPT_FEATURES_STYLES */`;

		// Combine feature CSS blocks into a single CSS string if enabled in the current settings
		for (let key in cssByFeature) {
			if (Object.prototype.hasOwnProperty.call(cssByFeature, key)) {
				if (typeof defaultSettings[key] !== 'undefined' && defaultSettings[key].enabled) {
					cssStyles += cssByFeature[key] + '\n';
				}
			}
		}

		cssStyles = cssStyles.replaceAll('\t', ' ');
		return cssStyles;
	};

	const renderFeaturesStyles = () => {
		const css = constructFeaturesCss();
		GM_addStyle(css);
	};

	/* Stub for the later update */
	// const removeFeaturesStyles = () => {
	// 	let style_elements = document.querySelectorAll('style');

	// 	style_elements.forEach(style_el => {
	// 		if (style_el.innerHTML.includes('USERSCRIPT_FEATURES_STYLES')) {
	// 			style_el.remove();
	// 		}
	// 	});
	// };

	renderFeaturesStyles();
})();
