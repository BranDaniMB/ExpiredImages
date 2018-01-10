/**
 * ExpiredImages
 *
 * - Original version by User:BranDaniMB
 * - Based in http://dev.wikia.com/wiki/LockOldBlogs
 * 
 * License: CC-BY-SA - http://creativecommons.org/licenses/by-sa/3.0/
**/
$(document).ready(function () {
    // Check namespace
    if (mediaWiki.config.get('wgNamespaceNumber') === 6) {
        // Create list of image categories
        var Categories = mediaWiki.config.get('wgCategories');

        // Verify that the image belongs to the category
        if (Categories.includes("Imágenes en espera de uso")) {
            if (typeof ExpiredImages !== "object" || ExpiredImages === null) {
                ExpiredImages = {};
            }
            if (typeof ExpiredImages.expiryDays !== "number") {
                ExpiredImages.expiryDays = 30;
            }
            if (typeof ExpiredImages.expiryMessage !== "string") {
                ExpiredImages.expiryMessage = "Esta imagen excedió el plazo fijado de <expiryDays> días.";
            }
            if (typeof ExpiredImages.nonExpiryMessage !== "string") {
                ExpiredImages.nonExpiryMessage = "Esta imagen no ha excedido el plazo fijado de <expiryDays> días.";
            }
            if (typeof ExpiredImages.expiryCategory !== "string") {
                ExpiredImages.expiryCategory = "Imágenes en espera de uso";
            }
            // it replaces <expiryDays> with its value in ExpiredImages.expiryDays and ExpiredImages.nonExpiryMessage
            ExpiredImages.expiryMessage = ExpiredImages.expiryMessage.replace(/<expiryDays>/g, ExpiredImages.expiryDays);
            ExpiredImages.nonExpiryMessage = ExpiredImages.expiryMessage.replace(/<expiryDays>/g, ExpiredImages.expiryDays);

            var wgCategories = mw.config.get('wgCategories'),
                wgArticleId = mw.config.get("wgArticleId"),
                url,
                expired,
                expiryMilliseconds,
                diffMilliseconds;

            // Check the time since image upload
            url = "/api.php?action=query&format=json&prop=info&inprop=created&pageids=" + wgArticleId;
            $.getJSON(url, function (data) {
                try {
                    var created = data.query.pages[wgArticleId].created; // e.g. 2010-09-29T01:47:30Z
                    expiryMilliseconds = ExpiredImages.expiryDays * 24 * 60 * 60 * 1000;
                    diffMilliseconds = new Date().getTime() - new Date(created).getTime();
                    expired = diffMilliseconds > expiryMilliseconds;
                    if (expired) {
                        alert(ExpiredImages.expiryMessage);
                    } else {
                        alert(ExpiredImages.nonExpiryMessage);
                    }
                } catch (e) {
                    console.log("Error");
                    return;
                }
            });
        }
    }
});
