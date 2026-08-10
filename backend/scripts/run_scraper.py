from app.pipeline import run


def main():
    summary = run()
    print("Scrape summary:")
    for source, stats in summary.items():
        print(f"  {source}: fetched={stats['fetched']} created={stats['created']} updated={stats['updated']}")


if __name__ == "__main__":
    main()
