class EventTypes {
    public static get PlayerDataUpdate(): string { return "PlayerDataUpdate"; }
    public static get GamesDataUpdate(): string { return "GamesDataUpdate"; }
    public static get StatsDataUpdate(): string { return "StatsDataUpdate"; }
    public static get WaitingListUpdate(): string { return "WaitingListUpdate"; }
}
export = EventTypes;