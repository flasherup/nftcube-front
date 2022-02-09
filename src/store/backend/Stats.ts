export default  class Stats {
    protected stats:Object = {}
    setStats(value:Object) {
        this.stats = value;
    }

    getStats():Object {
        return this.stats
    }
}

export const statsStorage = new Stats();


