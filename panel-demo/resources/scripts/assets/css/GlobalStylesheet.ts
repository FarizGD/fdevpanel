import tw from 'twin.macro';
import { createGlobalStyle } from 'styled-components/macro';

export default createGlobalStyle`
    body {
        ${tw`font-sans text-neutral-200`};
        background: var(--fdev-bg);
        min-height: 100vh;
        letter-spacing: 0;
        color-scheme: dark;
        font-size: 14px;
    }

    h1, h2, h3, h4, h5, h6 {
        ${tw`font-medium tracking-normal font-header`};
    }

    p {
        ${tw`text-neutral-200 leading-snug font-sans`};
    }

    form {
        ${tw`m-0`};
    }

    textarea, select, input, button, button:focus, button:focus-visible {
        ${tw`outline-none`};
    }

    input[type=number]::-webkit-outer-spin-button,
    input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
    }

    input[type=number] {
        -moz-appearance: textfield !important;
    }

    /* Scroll Bar Style */
    ::-webkit-scrollbar {
        background: none;
        width: 16px;
        height: 16px;
    }

    ::-webkit-scrollbar-thumb {
        border: solid 0 rgb(0 0 0 / 0%);
        border-right-width: 4px;
        border-left-width: 4px;
        -webkit-border-radius: 9px 4px;
        -webkit-box-shadow: inset 0 0 0 1px hsl(211, 10%, 53%), inset 0 0 0 4px hsl(209deg 18% 30%);
    }

    ::-webkit-scrollbar-track-piece {
        margin: 4px 0;
    }

    ::-webkit-scrollbar-thumb:horizontal {
        border-right-width: 0;
        border-left-width: 0;
        border-top-width: 4px;
        border-bottom-width: 4px;
        -webkit-border-radius: 4px 9px;
    }

    ::-webkit-scrollbar-corner {
        background: transparent;
    }

    
    a, button, input, select, textarea { transition: color 140ms, background-color 140ms, border-color 140ms; }
    :focus-visible { outline: 2px solid var(--fdev-focus) !important; outline-offset: 3px; }
    input, select, textarea { border-radius: 7px !important; }
    button { text-transform: none; letter-spacing: 0; }
    ::selection { background: #264f78; color: #fff; }
    .fdev-card { border: 1px solid var(--fdev-border); border-radius: 8px; overflow: hidden; background: var(--fdev-surface); box-shadow: 0 4px 16px #0002; }
    .fdev-card-header { background: var(--fdev-surface); border-bottom: 1px solid var(--fdev-border); padding: 12px 16px; }
    .fdev-card-body { padding: 16px; }
    .fdev-titlebar { display: flex; align-items: center; gap: 8px; padding: 12px 0; margin-bottom: 18px; border-bottom: 1px solid var(--fdev-border); font-size: 12px; color: #aaa; }
    .fdev-titlebar { flex-wrap: wrap; }
    .fdev-titlebar strong { color: #ddd; font-weight: 500; }
    .fdev-titlebar .fdev-dot { width: 6px; height: 6px; border-radius: 50%; background: #75beff; }
    .fdev-navigation { border-bottom: 1px solid var(--fdev-border); position: sticky; top: 0; z-index: 40; background: var(--fdev-surface); }
    .fdev-navigation #logo { min-width: 0; }
    .fdev-navigation #logo a { display: flex; align-items: center; gap: 10px; font-size: 16px; white-space: nowrap; min-width: 0; }
    .fdev-navigation #logo img { width: 30px; height: 30px; flex-shrink: 0; }
    .fdev-navigation #logo .fdev-brand-name { overflow: hidden; text-overflow: ellipsis; }
    .fdev-navigation #logo small { display: block; font-size: 10px; color: var(--fdev-muted); letter-spacing: .08em; line-height: 1.3; }
    .fdev-server-context { display: flex; align-items: center; gap: 12px; max-width: 1200px; margin: 0 auto; padding: 16px; }
    .fdev-server-context img { width: 28px; height: 28px; }
    .fdev-server-context h1 { font-size: 18px; line-height: 1.3; overflow-wrap: anywhere; }
    .fdev-server-context p { font-size: 12px; color: var(--fdev-muted); margin-top: 4px; }
    .fdev-page-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; border-top: 1px solid var(--fdev-border); padding-top: 14px; font-size: 11px; color: var(--fdev-muted); }
    .fdev-message.fdev-message { background: var(--fdev-surface); border-color: var(--fdev-border); padding: 12px 16px; gap: 10px; }
    .fdev-message[data-type='error'] { background: #35242a; border-left: 3px solid #f48771; }
    .fdev-message[data-type='warning'] { background: #332c20; border-left: 3px solid #cca700; }
    .fdev-message[data-type='success'] { background: #20312a; border-left: 3px solid #89d185; }
    .fdev-message[data-type='info'] { background: #202e3c; border-left: 3px solid #75beff; }
    .fdev-message .title { background: transparent; padding: 0; text-transform: none; font-weight: 600; }
    .fdev-server-row.fdev-server-row { border-color: var(--fdev-border); background: var(--fdev-surface); min-height: 92px; }
    .fdev-server-row:hover { background: var(--fdev-raised); border-color: #596779; }
    .fdev-server-row .icon { border-radius: 10px; background: #007acc18; color: #75beff; border: 1px solid #007acc30; width: 44px; height: 44px; }
    .fdev-server-row .fdev-row-state { display: inline-flex; margin-top: 6px; border: 1px solid var(--fdev-border); padding: 2px 7px; border-radius: 4px; font-size: 11px; text-transform: capitalize; color: var(--fdev-muted); }
    .fdev-auth-shell { min-height: 100vh; display: grid; align-items: center; padding: 36px 16px; }
    .fdev-auth { width: min(100%, 900px); margin: 0 auto; }
    .fdev-auth-card { display: grid; grid-template-columns: .9fr 1.1fr; border: 1px solid var(--fdev-border); border-radius: 12px; overflow: hidden; background: var(--fdev-surface); box-shadow: 0 24px 70px #0003; }
    .fdev-auth-brand { padding: 40px 30px; background: #1b2531; display: flex; flex-direction: column; justify-content: center; border-right: 1px solid var(--fdev-border); }
    .fdev-auth-brand img { width: 58px; height: 58px; margin-bottom: 24px; }
    .fdev-auth-brand h1 { font-size: 28px; font-weight: 600; letter-spacing: -.03em; }
    .fdev-auth-brand p { margin: 14px 0 24px; color: var(--fdev-muted); line-height: 1.6; font-size: 14px; }
    .fdev-auth-brand span { font-size: 12px; color: #75beff; }
    .fdev-auth-form { padding: 36px; min-width: 0; }
    .fdev-auth-form h2 { font-size: 21px; margin-bottom: 24px; }
    .fdev-auth-form input { background: var(--fdev-input); color: var(--fdev-text); border-color: var(--fdev-border); }
    .fdev-auth-form label { color: var(--fdev-text); }
    .fdev-auth-form a { color: #75beff; text-transform: none; font-size: 13px; }
    @media(max-width: 640px) {
        .fdev-navigation #logo small { display: none; }
        .fdev-navigation #logo img { width: 24px; height: 24px; }
        .fdev-auth-card { grid-template-columns: 1fr; }
        .fdev-auth-brand { padding: 24px; border-right: 0; border-bottom: 1px solid var(--fdev-border); }
        .fdev-auth-brand img { width: 40px; height: 40px; margin-bottom: 12px; }
        .fdev-auth-brand h1 { font-size: 23px; }
        .fdev-auth-brand p { margin: 8px 0 0; }
        .fdev-auth-brand span { display: none; }
        .fdev-auth-form { padding: 24px; }
        .fdev-server-row.fdev-server-row { padding: 12px; }
    }
    .fdev-native-note { border-left: 2px solid #007acc; padding: 8px 12px; background: #007acc0d; color: #aaa; font-size: 12px; margin-bottom: 16px; }
    .CodeMirror.cm-s-ayu-mirage { background: var(--fdev-input); color: var(--fdev-text); border: 1px solid var(--fdev-border); border-radius: 6px; }
    .CodeMirror.cm-s-ayu-mirage .CodeMirror-gutters { background: var(--fdev-input); border-right: 1px solid var(--fdev-border); }
    .CodeMirror.cm-s-ayu-mirage .CodeMirror-activeline-background { background: #007acc12; }
    .CodeMirror-dialog, .CodeMirror-hints { background: var(--fdev-raised); color: var(--fdev-text); border: 1px solid var(--fdev-border); }
    @media(max-width:640px) {
        .fdev-navigation a, .fdev-navigation button, .fdev-navigation .navigation-link { padding-left: 12px; padding-right: 12px; }
        .fdev-navigation #logo a { font-size: 16px; padding-left: 12px; }
        .fdev-card-body { padding: 12px; }
    }
    @media(prefers-reduced-motion:reduce) {
        *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
    }

    .fdev-client #fdev-main { min-width: 0; }
    .fdev-client #fdev-main h1, .fdev-client #fdev-main h2, .fdev-client #fdev-main h3 { overflow-wrap: anywhere; }
    .fdev-client #fdev-main .grid > *, .fdev-client #fdev-main .flex-1 { min-width: 0; }
    @media(max-width: 640px) {
        .fdev-client button { min-height: 44px; min-width: 44px; }
        .fdev-client form input:not([type='checkbox']):not([type='radio']):not([type='hidden']),
        .fdev-client form select, .fdev-client form textarea { font-size: 16px; min-height: 44px; }
        .fdev-client form textarea { min-height: 84px; }
        .fdev-auth-shell { padding: 16px 12px; min-height: 100dvh; }
        .fdev-navigation #logo a { gap: 6px; }
        .fdev-navigation a, .fdev-navigation button, .fdev-navigation .navigation-link { padding-left: 9px; padding-right: 9px; }
        .fdev-server-context { padding: 12px; }
        .fdev-page-footer { padding-bottom: env(safe-area-inset-bottom, 0px); }
    }
`;
