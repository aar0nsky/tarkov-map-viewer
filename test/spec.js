const assert = require("assert")


describe("Tarkov Map Viewer", function () {
    this.timeout(10000)

    beforeEach(() => {

    })

    afterEach(() => {
    })

    it('shows an initial window', async () => {
        const count = await app.client.getWindowCount();
        return assert.equal(count, 1);
    });

    it('has the correct title', async () => {
        const title = await app.client.waitUntilWindowLoaded().getTitle();
        return assert.equal(title, 'Tarkov Map Viewer');
    });

})
