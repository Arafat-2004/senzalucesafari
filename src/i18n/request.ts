// i18n temporarily disabled (April 2026)
// Do not remove — will be re-enabled later

import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    // Force English locale - i18n disabled
    const locale = 'en';

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
