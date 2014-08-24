using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTF2014Schedule
{
  using System.IO;

  using Newtonsoft.Json;

  class Program
  {
    static void Main(string[] args)
    {
      //FixDataIssues();
      var processedFile = @"C:\CODE\HTF2014\HTF2014 Schedule_processed.csv";
      var outputJsonFile = @"C:\CODE\HTF2014\HTF2014Schedule.js";

      var lines = File.ReadAllLines(processedFile);
      var sessions = new List<Session>();
      
      File.Delete(outputJsonFile);
      var counter = 1;
      for (int index = 0; index < lines.Length; index++)
      {
        var line = lines[index];
        var sessionStartIndexTime = new Dictionary<int, string>()
                                      {
                                        { 2, "9:30" },
                                        { 5, "10:40" },
                                        { 8, "13:00" },
                                        { 11, "14:10" },
                                        { 14, "16:00" },
                                        { 17, "17:10" },
                                      };

        
        foreach (var sessionIndex in sessionStartIndexTime)
        {
          sessions.Add(CreateSession(sessionIndex, line, counter));
          counter++;
        }
      }

      var confDay = new ConfDay(){ Day  = "9/13", Sessions = sessions.OrderBy(x => x.Order).ThenBy(x => x.ScheduledRoom).ToArray() };
      var json = JsonConvert.SerializeObject(confDay);

      var streamWriter = File.CreateText(outputJsonFile);
      streamWriter.Write(json);
      streamWriter.Close();
      streamWriter.Dispose();
    }

    private static Session CreateSession(KeyValuePair<int, string> sessionStartIndexTime, string line, int id)
    {
      var dataItems = line.Split(',');
      var category = dataItems[0];
      var scheduledRoom = dataItems[1];
      var sessionStartIndex = sessionStartIndexTime.Key;
      var time = sessionStartIndexTime.Value;
      var title = dataItems[sessionStartIndex];
      var speakerNames = dataItems[sessionStartIndex + 1];

      return new Session()
               {
                 Category = category,
                 Description = title,
                 Id = id,
                 ScheduledRoom = scheduledRoom,
                 SpeakerNames = speakerNames,
                 Speakers = speakerNames,
                 Title = title,
                 Time = time
               };

    }

    public class ConfDay
    {
      public string Day { get; set; }
      public Session[] Sessions { get; set; }
    }

    public class Session
    {
      public string Category { get; set; }
      public string Description { get; set; }
      public int Id { get; set; }
      public bool isInMySchedule { get; set; }
      public string ScheduledRoom { get; set; }
      public string SpeakerNames { get; set; }
      public string Speakers { get; set; }
      public string Time { get; set; }
      public string Title { get; set; }

      public int Order { get
      {
        var substringLength = Time.Split(':')[0].Length;
        return Convert.ToInt16(Time.Substring(0,substringLength));
      }}
    }
    private static void FixDataIssues()
    {
      var schedule = File.ReadAllText(@"C:\CODE\HTF2014\HTF2014 Schedule_sanitized.csv");
      var speakers = File.ReadAllLines(@"C:\CODE\HTF2014\HTF2014Speakers.txt");
      var processedFile = @"C:\CODE\HTF2014\HTF2014 Schedule_processed.csv";

      File.Delete(processedFile);

      foreach (var speaker in speakers)
      {
        schedule = ReplaceString(schedule, speaker, "," + speaker + ",", StringComparison.OrdinalIgnoreCase);
      }

      var newSchedule = File.CreateText(processedFile);
      newSchedule.Write(schedule);
      newSchedule.Flush();
      newSchedule.Close();
    }

    public static string ReplaceString(string str, string oldValue, string newValue, StringComparison comparison)
    {
      StringBuilder sb = new StringBuilder();

      int previousIndex = 0;
      int index = str.IndexOf(oldValue, comparison);
      while (index != -1)
      {
        sb.Append(str.Substring(previousIndex, index - previousIndex));
        sb.Append(newValue);
        index += oldValue.Length;

        previousIndex = index;
        index = str.IndexOf(oldValue, index, comparison);
      }
      sb.Append(str.Substring(previousIndex));

      return sb.ToString();
    }
  }
}
