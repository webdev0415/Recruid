export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
export const HEX_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
export const MOUSTACHE_VARIABLE_REGEX = /{{[\w]+\.[\w]+}}/g;
// const MOUSTACHE_VARIABLE_REGEX = /{{#with [\w]+}}{{#if [\w]+}}{{[\w]+}}{{else}}{{[\w]+}}{{\/if}}{{\/with}}/g;;
export const MENTION_REGEX = /[@][[][^\]]*[\]][(][^)]*[)]/g;
export const NUMBER_REGEX = /^[0-9]+$/;
