---
title: First Computer Build!
slug: first-computer-build
date: 2017-10-11
type: post
tags: [recording/editing tools, tools/software, reviews, random]
---

[youtube]tr7eYLNtlJY[/youtube]

## Update

So I haven't been posting any videos for several reasons but mainly because my laptop's fan started making a lot of noise. It sounded like it was on the verge of dying, so I didn't want to leave anything rendering on it. Initially I just planned to replace it but the only place that could get me the right model gave me a ridiculous quote (like $60) for what was probably a third party $5 chinese fan and I didn't want to go through the trouble of importing it myself.

I thought, to hell with it, I'd rather save up and switch to a desktop, their parts are actually priced reasonably (by which I mean ~1.5 x US prices instead of 2-2.5 like nearly everything else, ~~kill me~~) and it's easier to upgrade/repair. Also it's not like I move around as much as I used to when I bought the laptop. The only thing it really had going for it at this point was the battery because there's a lot of power outages where I live, but then battery started to die for the third time now, so even more reason to replace it. The only thing I'm sad about is that the 16GB RAM sticks I had ordered for it finally arrived (along with quite a few other art supplies and stuff I hope to be reviewing soon). I tested those for a while and I just cannot go back to just 8GBs anymore.

## Parts

This is technically my first build. I have completely disassembled/reassembled laptops for cleaning/fixing, and I've changed parts on PCs, but never from scratch. I read up a bit before doing it, got stuck a few times with the cables, but all in all it was honestly the easiest part. If you've never built a PC there's plenty of videos showing you how to connect everything step by step, I won't even bother. I think it was harder to choose the parts and make sure they were all compatible and had what I needed more than anything else. There's websites like [PC Parts Picker](https://pcpartpicker.com/list/) that can help you, but just because the parts are compatible doesn't mean that's they're best you can buy for the money or that all the parts are taking full advantage of each other.

### Motherboard and CPU

A great example of that is the motherboard and the CPU. Sure you could get the cheapest motherboard that supports the cheapest CPU that meets your needs, but that probably wouldn't be the best idea.

For example, Intel's 7400 i5 is about the same price here as AMD's Ryzen 1500X. Before Ryzen, AMD vs Intel was a no-brainer, but now, Ryzen chips are better for the price at nearly everything except gaming. But supposing they were the same, that specific i5 (the cheapest) is also locked, while the Ryzen isn't which means it can be overclocked. And there's the plus that AMD doesn't plan to change the AM4 socket for 4 years (Intel changes their's every 2 years).

Here's where picking a motherboard can get tricky. Motherboards have three main compatibility criteria:

   - **Form Factor** - which just means the size (this only matters if you want a small case)
   - **Socket** - which has to match the CPU
   - **Chipset** - which is like the brain's of the motherboard and determines what the motherboard does/doesn't support in terms of overclocking, CrossFire/SLI (multiple graphics cards), and a few other things that usually aren't too important (e.g. max number of SATA and USB connections, RAID support, etc).

#### Ryzen Chipsets

|Chipset      |A320    |B350   |X370   |
|-------------|--------|-------|-------|
|Overclocking | No     | Yes   | Yes   |
|Crossfire    | No     | Yes   | Yes   |
|SLI          | No     | No    | Yes   |

As you can see to take advantage of the Ryzen 1500X and overclock it I needed to get at least the B350. The X370 is overkill for me because I won't be able to afford a 1070 (the minimum needed to SLI) anytime soon, let alone two, and looking at benchmarks a single 1080 still seems to do better than two 1070s.

I didn't even bother comparing the Intel chipsets because the difference between just a locked/unlocked i5 was much greater than the difference between the A320 and the B350 motherboards for the Ryzen.

After looking at several B350 motherboards I ended up going with a [GA-AB350M-Gaming 3](https://www.gigabyte.com/Motherboard/GA-AB350M-Gaming-3-rev-10#kf) because it was cheap and has a dual bios and bios flashes are always dangerous and I knew it was likely to need a few updates and I've had a motherboard die trying to upgrade the BIOS to support a new graphics card. It had some bad reviews, but most of them were complaining about problems with the BIOS and since it's fairly new that's to be expected. I updated and everything is working fine. It's best to do this manually through a USB btw instead of from within an OS through an app, check your motherboard for specific instructions. 

I was able to overclock just fine. Also my RAM auto-overclocked itself to 2400MHz without having to enable X.M.P. or anything. More on that below.

#### Overclocking the CPU

I tried two different ways to overclock, through the BIOS and through AMD's Ryzen Master. I initially had the same problems with Ryzen Master. At one point it wouldn't reset to defaults, and even the defaults when applied felt a little bit different than the real defaults (after restart/uninstalling). So I went to the BIOS, disabled Core Performance Boost, Global C-State Controls, and Cool'n'Quiet as recommended and I got a stable (w/ 1 hour stress test) overclock at 3.8GHz @ 1.38V (+1.26 offset) with max temps of 67°C. I could get 3.9GHz but at 1.45V (+2.00 offset) with temps reaching 76°C, which I would not leave for long term use. Btw I used HWiNFO to get the voltage reading because it looked like the most accurate (and Ryzen would not read voltage when overclocked from the BIOS).

I then went to enable Global C-State Controls and Cool'n'Quiet again (not Core Performance Boost!) to see if I could get the CPU to downclock when idle. It was stable but it wouldn't lower the frequency, just the voltage, not sure what that means? So I switched back to using Ryzen Master because it downclocks properly. The only problem with it is it doesn't apply the overclock on startup, you have to apply it manually, it's not too much of a bother, it's kind of nice I can only turn it on if I know I'll need it.


### RAM

Like I mentioned after trying 16GB I could not got back to 8GB. Photoshop especially can handle much larger canvases than it used to and now I can run 3-4 large programs and 20 Chrome tabs at the same time and have yet to reach 100%, it's great.

I got a single Kingston Fury DDR4 2400Mhz 16GB stick that "auto-overclocked" itself to 2400Mhz from the start (on the BIOS it came with, version F4). I say "auto-overclocked" because the advertized speed is already an overclock, it's like the speed it's been tested to be stable at, but some memories need to be manually enabled in the BIOS by enabling X.M.P. to run above 2133Mhz.

It should be possible to overclock it further, but I have not tried it yet.

### Graphics Card

I got a 1050 Ti with 4GBof VRAM and I got the best one I could find, a Zotac OC edition with dual fans. I was tempted to get a 1060 3GB but I only I had enough money to "push" one thing (RAM, CPU, or GPU) and I chose RAM because of the reasons I said and also because any graphics card would be an improvement over what I was using. I reasoned if I found it lacking, I would then save up for something a lot better (at least the 6GB 1060).

In the video though I'm using an old 545 just because the graphics card hadn't arrived yet. I was going to sell it, but the 1050 Ti makes the screen freeze a bit when rendering because the Ryzen doesn't have built-in graphics, so I might just keep it to drive the display.

### Power Supply

So the market here for power supplies is 90% cheap Senteys, then 18% were known brand names (Thermaltake, etc) but they were often overpriced for the quality of the PSU (look up Tier lists online). They were all Tier 4, which is better than an untiered unrated Sentey anyday, but it's usually recommended you get something better if you're overclocking.

There were no Tier 1 PSUs available, but there a few (2%) Tier 2 PSUs: Seasonic's (S12II and M12II) but they were 520W (Bronze rated, non-modular) and 620W (Bronze, modular) respectively, and for a little bit less than the 620W one there was an XFX XTR 650W which was Gold rated and modular. Although the computer doesn't need anything near even 500W, I got the XFX because it was the best value for the price and basically future proof. Unlike the graphics card which is easy to sell, I imagine it's a bit harder to sell a used PSU. Also, now that I might use both graphic's card, I'm even more glad I got it.

If you know nothing about Power Supplies, like I said, look at a Tier list and get the best you can afford. A basic White 80 Plus rating is a must, but that doesn't guarantee quality. The rating is just how power efficient the PSU is, though of course because you need better components to achieve better efficiency the higher ratings have some correlation with quality (if the PSU you find happens to not be tiered). Apart from quality though, it's good to get a high rating if you'll be leaving things to render overnight, etc.

### Case

Much like with the PSU, 80% of the market is Sentey cases, with the rest being way overpriced because they tend to import the nicest brand name models. Unlike the PSU though there isn't as much of a problem going cheaper so long as you shop around, and I found this nice [Sentey GS-6000](http://www.sentey.com/es/optimus-black-gs-6000) model that came with 4 fans (one of which is a huge 120mm side fan), a dust filter, an SD card reader, and 4 HDD bays for 3.5" and 2.5" drives. Ph and a fan controller, but I didn't use it.

Now it had it's problems, the frontal HDD fan didn't work (but I had everything built by then and couldn't care to replace it), and the HDD bays were badly designed. They did not fit 2.5" drives as advertised which is something I wanted because I have three 2.5" drives. Well technically they did fit, you can screw them in, but they're so far in, you can't connect them to the power supply or the data cables. I had to drill holes along the edge of the bracket, add masking tape where the circuitry touched the metal, and secure the back with masking tape as well. 

But I was kind of expecting something to go wrong so I don't regret it. In the end it worked just fine. The drives have been fine with my fix, and apart from the SSD (which didn't need any masking tape or anything because it's all plastic), I will probably replace the drives for 3.5" drives in the future. I will replace that frontal fan someday when it needs cleaning, otherwise the other fans have worked great, they're nice and silent (compared to a cheaper Sentey case I've heard), there's good ventilation, and all the other buttons/connections/LEDs work.

### Monitor

Lastly I want to take a moment to rant about monitors for a second. On my laptop I had a monitor that covered of the ~95% NTSC color gamut. The colors on it were great. As far as I know it's a TN panel and it's viewing angles are superb. I love it.

Now there aren't any affordable monitors here with a similar color gamut, so it was either a cheap TN or a cheap IPS, so I thought ok, I'll get an IPS, I heard they were great. Well I honestly don't understand how people can say that (well I can see it compared to a cheap TN panel, but not a good one).

I got an LG 24MP48HQ-P and at first I didn't notice the IPS glow. Something seemed off about the colors, the black and grays seemed off, I thought it was just a transition from a good monitor to an ok one, I kept fiddling with the settings and couldn't make it look right. Then I put it next to my monitor and I noticed the viewing angles were just awful. All the viewing angles were way worse because of the IPS glow. Even compared to other TN monitors around the house, even compared to the old Dell one I ended up using which has the worst viewing angles. Once I saw the glow I could not unsee the glow.

Now I do sit very close (~40cm) because that's what I'm used to and also I'm having some eye problems and that's the farthest I can see with my glasses, but the monitor needed at least a meter for the glow to go away which is a ridiculous distance and this was WITH ambient light. I don't know if higher quality monitors (like a Dell Ultrasharp) are better, but I still find reports about IPS glow for even expensive monitors, so I don't want to buy anything else without seeing it and here it's very rare for monitors to be on display for some reason and there are NO return policies. I have seen a few TN monitors on display but they were clearly bad quality. I'm stuck now trying to resell this thing and don't want to be stuck with another. There are a few AMVA panel monitors, but I can't find much info on how the blacks compare to a good TN panel, only how they're better than IPS, but how much better? If anybody knows I'd love to hear. It's either that or I'm considering getting the more expensive 144Hz TN monitors used for gaming because on reviews they seem to have decent viewing angles like my laptop's monitor. 

Also anybody know why some TN monitors can achieve better viewing angles? I remember I used to own one of those convertible tablet PCs and the TN screen had horrible viewing angles, it was only 12" but if you didn't look at it dead on, the colors distorted A LOT. So when I was shopping for my laptop I made sure to get a screen that had good viewing angles and it did.